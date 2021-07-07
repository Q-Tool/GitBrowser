const IPC = require('./index');
const fs = require('fs');

const listRepos = async (args) => {
    const workdir = await IPC.getStore({key: 'workdir'});
    return fs.readdirSync(workdir, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

module.exports = listRepos;