let ipcRenderer, ipcMain;

if(process && process.type === 'browser'){ // Electron main process
    ipcMain = require('electron').ipcMain;
} else { // Electron Render Process
    ipcRenderer = window.require('electron').ipcRenderer;
}




const IPCHandler = {
    isMainThread: false,

    IPCS: [
        "setMenu"
    ],

    IPCObj: {},

    // initializes the IPC's based on context
    init: async () => {
        IPCHandler.isMainThread = process && process.type === 'browser';
        if(IPCHandler.isMainThread){
            IPCHandler.IPCS.map(async (IPC) => {
                IPCHandler.IPCObj[IPC] = require(`./${IPC}`);

                return ipcMain.handle(IPC, async(handle, args) => {
                    return await IPCHandler.IPCObj[IPC](JSON.parse(args));
                })
            });
        }
    },

    call: async (name, args) => {
        if(IPCHandler.isMainThread && IPCHandler.IPCObj[name]){
            return await IPCHandler.IPCObj[name](args);
        } else if(!this.isMainThread){
            return await ipcRenderer.invoke(name, JSON.stringify(args));
        }

        return null;
    }
};

module.exports = IPCHandler;