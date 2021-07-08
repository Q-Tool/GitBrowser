let ipcRenderer, ipcMain;

if(process && process.type === 'browser'){ // Electron main process
    ipcMain = require('electron').ipcMain;
} else { // Electron Render Process
    ipcRenderer = window.require('electron').ipcRenderer;
}

const IPCHandler = {
    isMainThread: false,

    IPCS: [
        "setMenu",
        "getStore",
        "setStore",
        "askWorkDir",
        "cloneRepo",
        "listRepos",
        "getBranches",
        "repoStatus",
        "gitCheckout",
        "gitLog",
        "gitPull",
        "getFileList",
        "getFileContent"
    ],

    IPCObj: {},

    // initializes the IPC's based on context
    init: async () => {
        IPCHandler.isMainThread = process && process.type === 'browser';
        if(IPCHandler.isMainThread){
            IPCHandler.IPCS.map(async (IPC) => {
                IPCHandler.IPCObj[IPC] = require(`./${IPC}`);
                IPCHandler[IPC] = async (args = {}) => {
                    return await IPCHandler.call(IPC, args);
                }
                return ipcMain.handle(IPC, async(handle, args) => {
                    return await IPCHandler.IPCObj[IPC](JSON.parse(args));
                })
            });
        } else {
            IPCHandler.IPCS.map(async (IPC) => {
                IPCHandler[IPC] = async (args = {}) => {
                    return await IPCHandler.call(IPC, args);
                }
            });
        }
    },

    call: async (name, args = {}) => {
        if(IPCHandler.isMainThread && IPCHandler.IPCObj[name]){
            return await IPCHandler.IPCObj[name](args);
        } else if(!this.isMainThread){
            return await ipcRenderer.invoke(name, JSON.stringify(args));
        }

        return null;
    }
};

module.exports = IPCHandler;