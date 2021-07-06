import {store as datastore} from '@risingstack/react-easy-state'
import store from "../IPC/client/store";
import IPC from '../IPC/index'

const GlobalState = datastore({
    repos: [],
    branches: [],
    currentRepo: null,
    workdir: null,
    init: async() => {
        let workDir = await store.get('workdir');
        if(!workDir){
            workDir = (await IPC.call('askWorkDir', [])).filePaths[0];
            await store.set('workdir', workDir);
        }
        GlobalState.workdir = workDir;
        console.log('workdir', workDir)

        await GlobalState.getRepos();

        const lastRepo = await store.get('lastRepo');
        GlobalState.currentRepo = lastRepo ? lastRepo : null;
    },
    getRepos: async () => {
        if(GlobalState.repos.length === 0){
            const repos = await IPC.call('listRepos', []);
            console.log(repos)
            GlobalState.repos = repos;
        }
        return GlobalState.repos;
    },
    addRepo: async (url) => {
        await IPC.call('cloneRepo', {repo: url});
        GlobalState.repos = [];
        await GlobalState.getRepos();
    },
    setRepo: async (index) => {
        GlobalState.currentRepo = GlobalState.repos[index];
        await GlobalState.getBranches();
    },
    getBranches: async () => {
        console.log(await IPC.call('getBranches', {repo: GlobalState.currentRepo}));
    }
});

GlobalState.init();

export default GlobalState;