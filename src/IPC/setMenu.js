const {Menu} = require('electron');

const setMenu = async (menuItems) => {
    const template = [
        ...process.platform === 'darwin' ? [{
            label: "GitBrowser",
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : [],
        ...menuItems
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

module.exports = setMenu;