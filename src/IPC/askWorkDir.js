const electron = require('electron');

const askWorkDir = async (args) => {
    const mainWindow = electron.BrowserWindow.getAllWindows()[0];
    const dialog = electron.dialog;
    return await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
}

module.exports = askWorkDir;