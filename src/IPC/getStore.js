const Store = require('electron-store');

const getStore = (args) => {
    const store = new Store();
    return store.get(args.key);
}

module.exports = getStore;