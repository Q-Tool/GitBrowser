import {store as datastore} from '@risingstack/react-easy-state'
import store from "../IPC/client/store";
import IPC from '../IPC/index'
import LoaderState from "./LoaderState";
import language_identify from "../lib/language_identify";
import path from 'path'

const GlobalState = datastore({
    repos: [],
    branches: [],
    directoryTree: {},
    diffTree: {},
    currentRepo: null,
    currentBranch: null,
    workdir: null,
    currentFile: null,
    currentFileType: 'text',
    commitHistory: [],
    showCommitHistory: false,
    currentCommit: '',
    canTraverseForward: false,
    canTraverseBackward: false,
    init: async() => {


        let workDir = await store.get('workdir');
        if(!workDir){
            workDir = (await IPC.askWorkDir()).filePaths[0];
            await store.set('workdir', workDir);
        }
        GlobalState.workdir = workDir;

        await GlobalState.getRepos();

        const lastRepo = await store.get('lastRepo');
        GlobalState.currentRepo = lastRepo ? lastRepo : null;
        if(GlobalState.currentRepo){
            LoaderState.addLoader('Restoring', async () => {
                const storedCommit = await store.get(`${GlobalState.currentRepo}.currentCommit`);
                const storedBranch = await store.get(`${GlobalState.currentRepo}.currentBranch`);
                await GlobalState.getBranches();

                if(storedBranch && storedBranch !== ''){ // Because we're on a commit, checkout the stored branch
                    await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: storedBranch});
                }

                //await GlobalState.gitPull(); // Pull any changes to the repository
                await GlobalState.gitLog(); // Get the commit history while we're here

                if(storedCommit && storedCommit !== ''){ // restore the current commit
                    await GlobalState.setCommit(storedCommit);
                } else {
                    await GlobalState.getFiles();
                }

            });
        }
    },
    getRepos: async () => {
        if(GlobalState.repos.length === 0){
            LoaderState.addLoader('Getting Repos', async () => {
                const repos = await IPC.listRepos();
                GlobalState.repos = repos;
            });
        }
        return GlobalState.repos;
    },
    addRepo: async (url) => {
        LoaderState.addLoader('Adding Repo', async() => {
            await IPC.cloneRepo({repo: url});
            GlobalState.repos = [];
            GlobalState.getRepos();
        });
    },
    setRepo: async (repo) => {
        if(repo){
            LoaderState.addLoader('Setting Repo', async() => {
                GlobalState.currentRepo = repo;
                await store.set('lastRepo', repo);
                GlobalState.getBranches();
                GlobalState.getFiles();
                GlobalState.gitLog();
            });
        }
    },
    getBranches: async () => {
        return LoaderState.addLoader('Getting Branches', async () => {
            const branchData = await IPC.getBranches({repo: GlobalState.currentRepo});
            GlobalState.branches = branchData.all;
            const storedBranch = await store.get(`${GlobalState.currentRepo}.currentBranch`);
            GlobalState.currentBranch = storedBranch ? storedBranch : branchData.current;
        });
    },
    setBranch: async (branch) => {
        if(branch){
            return LoaderState.addLoader('Setting Branch', async () => {
                // These variables are only used when the head is not on the branch (unset them)
                await store.set(`${GlobalState.currentRepo}.currentBranch`, null);
                await store.set(`${GlobalState.currentRepo}.currentCommit`, null);

                // This will checkout the branch
                GlobalState.currentBranch = branch;
                await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: branch});
                GlobalState.getFiles();
                GlobalState.gitLog();
                GlobalState.setCanTraverse();
            });
        }
        return null;
    },
    gitPull: async () => {
        if(GlobalState.currentRepo && GlobalState.currentBranch){
            return LoaderState.addLoader('Git Pull', async () => {
                const storedBranch = await store.get(`${GlobalState.currentRepo}.currentBranch`);
                const currentCommit = await store.get(`${GlobalState.currentRepo}.currentCommit`);

                // Because we have a commit checked out, we need to checkout our last branch
                if(storedBranch){
                    await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: storedBranch});
                }

                // Pull the branch (Getting needed data while we're here)
                await IPC.gitPull({repo: GlobalState.currentRepo});
                await GlobalState.getBranches();
                await GlobalState.gitLog();

                // Restore our commit
                if(currentCommit){
                    await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: GlobalState.currentCommit});
                }

                await GlobalState.getFiles();
            });
        }
        return null;
    },
    setCommit: async (commit) => {
        if(commit){
            const index = await GlobalState.findCommitIndex(commit);

            if(index === 0){ // Shouldn't be setting to a commit, but rather the branch
                return GlobalState.setBranch(GlobalState.currentBranch);
            }


            return LoaderState.addLoader('Setting Commit', async () => {
                await store.set(`${GlobalState.currentRepo}.currentBranch`, GlobalState.currentBranch);
                await store.set(`${GlobalState.currentRepo}.currentCommit`, commit);
                GlobalState.currentCommit = commit;
                await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: commit});
                GlobalState.setCanTraverse();
                GlobalState.getFiles();
            });
        }
    },
    gitLog: async () => {
        return LoaderState.addLoader('Getting Log', async() => {
            GlobalState.commitHistory = (await IPC.gitLog({repo: GlobalState.currentRepo})).all;
            GlobalState.setCanTraverse();
        });
    },
    getFiles: async () => {
        LoaderState.addLoader('Getting File List',async () => {
            GlobalState.directoryTree = await IPC.getFileList({repo: GlobalState.currentRepo});
            GlobalState.getDiff();
        })
    },
    getFileContents: async (file) => {
        LoaderState.addLoader('Loading File', async () => {
            GlobalState.currentFile = await IPC.getFileContent({
                file: file
            });
            GlobalState.currentFileType = language_identify(file).syntaxName;
        })
    },
    getDiff: async () => {
        return LoaderState.addLoader('Getting Diff', async () => {
            const index = await GlobalState.findCommitIndex();

            const commit = index === GlobalState.commitHistory.length - 1 ?
                "4b825dc642cb6eb9a060e54bf8d69288fbee4904" : // This commit hash is the same regardless of the repo, it represents the empty tree
                GlobalState.commitHistory[index + 1].hash;

            // Now that we have a diff that we can use, we need to build a directory tree.
            const diff = await IPC.gitDiff({repo: GlobalState.currentRepo, commit: commit});

            const diffList = {
                children: [],
                isDirectory: true,
                name: GlobalState.currentRepo,
                parentDirectory: GlobalState.workdir,
                path: path.join(GlobalState.workdir, GlobalState.currentRepo)
            };

            diff.files.forEach((file) => {
                GlobalState.fromDiffToTree(file, diffList);
            });

            GlobalState.diffTree = diffList;
        });
    },
    fromDiffToTree: (file, parent) => {
        const fileParts = file.file.split(path.sep);
        const nextFilePart = fileParts.shift();
        file.file = fileParts.join(path.sep);

        if(fileParts.length >= 1){ // This is a directory
            // check if new child already exists
            let childIndex = -1;
            parent.children.forEach((child, index) => {
                if(child.name === nextFilePart){
                    childIndex = index; // it already exists!!!
                }
            });

            if(childIndex === -1){
                const newChild = {
                    children: [],
                    isDirectory: true,
                    name: nextFilePart,
                    parentDirectory: parent.path,
                    path: path.join(parent.path, nextFilePart)
                }
                parent.children.push(newChild);
                GlobalState.fromDiffToTree(file, newChild);
            } else {
                GlobalState.fromDiffToTree(file, parent.children[childIndex]);
            }
        } else { // Adding a file
            const newChild = {
                isDirectory: false,
                name: nextFilePart,
                parentDirectory: parent.path,
                path: path.join(parent.path, nextFilePart),
                changes: file.changes,
                insertions: file.insertions,
                deletions: file.deletions,
                binary: file.binary
            }
            parent.children.push(newChild);
        }

    },
    findCommitIndex: async (commit = null) => {
        let index = 0;

        const currentCommit = commit ? commit : await store.get(`${GlobalState.currentRepo}.currentCommit`);
        if(currentCommit){
            for(const commit of GlobalState.commitHistory){
                if(commit.hash === currentCommit){
                    break;
                }
                index++;
            }
        }
        return index;
    },
    setCanTraverse: async () => {
        const index = await GlobalState.findCommitIndex();
        GlobalState.canTraverseForward = index !== 0;
        GlobalState.canTraverseBackward = GlobalState.commitHistory.length - 1 > index;
    },
    // negative integer goes backwards that amount, positive integer goes forward that amount. Zero resets to head of branch
    traverseHistory: async (amount) => {
        if(amount === 0){ // Resetting to the branch
            return GlobalState.setBranch(GlobalState.currentBranch);
        }

        const index = await GlobalState.findCommitIndex();

        // Forward through time is backward through the array, backward through time is forward in the array. It's flipped!
        const calculatedIndex = index - amount;

        if(calculatedIndex <= 0){ // Setting back to head (The end of history)
            return GlobalState.setBranch(GlobalState.currentBranch);
        } else if (calculatedIndex >= GlobalState.commitHistory.length - 1){ // The new index is beyond the beginning of history. Set to beginning of history
            return GlobalState.setCommit(GlobalState.commitHistory[GlobalState.commitHistory.length - 1].hash);
        } else { // Finally a valid index has been calculated, jump to that commit
            return GlobalState.setCommit(GlobalState.commitHistory[calculatedIndex].hash);
        }
    }
});

export default GlobalState;