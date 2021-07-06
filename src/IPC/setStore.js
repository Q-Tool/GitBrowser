const Store = require('electron-store');

const setStore = (args) => {
    const store = new Store();
    return store.set(args.key, args.value);
}

module.exports = setStore;