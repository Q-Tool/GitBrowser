const IPC = require('./index')
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const repoStatus = async (args) => {
    const repo = args.repo;
    const workdir = await IPC.getStore({key: 'workdir'});
    fs.mkdirSync(workdir, {recursive: true});

    const git = simpleGit(path.join(workdir, repo));
    return git.checkout(args.branch);
}

module.exports = repoStatus;