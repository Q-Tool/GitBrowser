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
            GlobalState.getBranches();
            GlobalState.getFiles();
            GlobalState.gitLog();
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
        LoaderState.addLoader('Getting Branches', async () => {
            const branchData = await IPC.getBranches({repo: GlobalState.currentRepo});
            GlobalState.branches = branchData.all;
            const storedBranch = await store.get(`${GlobalState.currentRepo}.currentBranch`);
            GlobalState.currentBranch = storedBranch ? storedBranch : branchData.current;
        });
    },
    setBranch: async (branch) => {
        if(branch){
            LoaderState.addLoader('Setting Branch', async () => {
                GlobalState.currentBranch = branch;
                await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: branch});
                GlobalState.getFiles();
                GlobalState.gitLog();
            });
        }
    },
    gitPull: async () => {
        if(GlobalState.currentRepo && GlobalState.currentBranch){
            LoaderState.addLoader('Git Pull', async () => {
                await IPC.gitPull({repo: GlobalState.currentRepo});
                GlobalState.getBranches();
                GlobalState.getFiles();
                GlobalState.gitLog();
            });
        }
    },
    setCommit: async (commit) => {
        if(commit){
            LoaderState.addLoader('Setting Commit', async () => {
                await store.set(`${GlobalState.currentRepo}.currentBranch`, GlobalState.currentBranch)
                await IPC.gitCheckout({repo: GlobalState.currentRepo, branch: commit});
                GlobalState.getFiles();
            });
        }
    },
    gitLog: async () => {
        LoaderState.addLoader('Getting Log', async() => {
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