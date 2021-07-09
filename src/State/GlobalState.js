import {store as datastore} from '@risingstack/react-easy-state'
import store from "../IPC/client/store";
import IPC from '../IPC/index'
import LoaderState from "./LoaderState";
import language_identify from "../lib/language_identify";

const GlobalState = datastore({
    repos: [],
    branches: [],
    directoryTree: {},
    currentRepo: null,
    currentBranch: null,
    workdir: null,
    currentFile: null,
    currentFileType: 'text',
    commitHistory: [],
    showCommitHistory: false,
    currentCommit: '',
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
            LoaderState.addLoader('Setting Commit', async () => {
                await store.set(`${GlobalState.currentRepo}.currentBranch`, GlobalState.currentBranch);
                await store.set(`${GlobalState.currentRepo}.currentCommit`, commit);
                GlobalState.currentCommit = commit;
                await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: commit});
                GlobalState.getFiles();
            });
        }
    },
    gitLog: async () => {
        return LoaderState.addLoader('Getting Log', async() => {
            GlobalState.commitHistory = (await IPC.gitLog({repo: GlobalState.currentRepo})).all;
        });
    },
    getFiles: async () => {
        LoaderState.addLoader('Getting File List',async () => {
            GlobalState.directoryTree = await IPC.getFileList({repo: GlobalState.currentRepo});
        })
    },
    getFileContents: async (file) => {
        LoaderState.addLoader('Loading File', async () => {
            GlobalState.currentFile = await IPC.getFileContent({
                file: file
            });
            GlobalState.currentFileType = language_identify(file).syntaxName;
        })
    }
});

export default GlobalState;