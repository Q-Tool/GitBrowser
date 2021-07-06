const IPC = require('./index')
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const getBranches = async (args) => {
    const repo = args.repo;
    const workdir = await IPC.call('getStore', {key: 'workdir'});
    fs.mkdirSync(workdir, {recursive: true});

    const git = simpleGit(path.join(workdir, repo));
    return git.branch();
}

module.exports = getBranches;