import {store as datastore} from '@risingstack/react-easy-state'
import store from "../IPC/client/store";
import IPC from '../IPC/index'
import LoaderState from "./LoaderState";

const GlobalState = datastore({
    repos: [],
    branches: [],
    currentRepo: null,
    currentBranch: null,
    workdir: null,
    init: async() => {
        let workDir = await store.get('workdir');
        if(!workDir){
            workDir = (await IPC.call('askWorkDir', [])).filePaths[0];
            await store.set('workdir', workDir);
        }
        GlobalState.workdir = workDir;

        await GlobalState.getRepos();

        const lastRepo = await store.get('lastRepo');
        GlobalState.currentRepo = lastRepo ? lastRepo : null;
        if(GlobalState.currentRepo){
            GlobalState.getBranches();
        }
    },
    getRepos: async () => {
        if(GlobalState.repos.length === 0){
            LoaderState.addLoader('Getting Repos', async () => {
                const repos = await IPC.call('listRepos', []);
                GlobalState.repos = repos;
            });
        }
        return GlobalState.repos;
    },
    addRepo: async (url) => {
        LoaderState.addLoader('Adding Repo', async() => {
            await IPC.call('cloneRepo', {repo: url});
            GlobalState.repos = [];
            await GlobalState.getRepos();
        });
    },
    setRepo: async (repo) => {
        if(repo){
            LoaderState.addLoader('Setting Repo', async() => {
                GlobalState.currentRepo = repo;
                await store.set('lastRepo', repo);
                await GlobalState.getBranches();
            });
        }
    },
    getBranches: async () => {
        LoaderState.addLoader('Getting Branches', async () => {
            const branchData = await IPC.call('getBranches', {repo: GlobalState.currentRepo});
            GlobalState.branches = branchData.all;
            GlobalState.currentBranch = branchData.current;
        });
    },
    setBranch: async (branch) => {
        if(branch){
            LoaderState.addLoader('Setting Branch', async () => {
                GlobalState.currentBranch = branch;
                await IPC.call('gitCheckout', {repo: GlobalState.currentRepo, branch: branch});
            });
        }
    }
});

GlobalState.init();

export default GlobalState;