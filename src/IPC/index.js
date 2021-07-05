let ipcRenderer, ipcMain;

if(process && process.type === 'browser'){
    ipcMain = require('electron').ipcMain;
} else {
    ipcRenderer = window.require('electron').ipcRenderer;
}




const IPCHandler = {
    isMainThread: false,

    IPCS: [
        "setMenu"
    ],

    IPCObj: {},

    // initializes the IPC's based on context
    init: async (isMainThread = false) => {
        this.isMainThread = isMainThread;
        if(this.isMainThread){
            IPCHandler.IPCS.map(async (IPC) => {
                IPCHandler.IPCObj[IPC] = require(`./${IPC}`);

                return ipcMain.handle(IPC, async(handle, args) => {
                    return await IPCHandler.IPCObj[IPC](JSON.parse(args));
                })
            });
        }
    },

    call: async (name, args) => {
        if(this.isMainThread && this.IPCObj[name]){
            return await IPCHandler.IPCObj[name](args);
        } else if(!this.isMainThread){
            return await ipcRenderer.invoke(name, JSON.stringify(args));
        }

        return null;
    }
};

module.exports = IPCHandler;