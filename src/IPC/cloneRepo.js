const IPC = require('./index')
const simpleGit = require('simple-git');
const fs = require('fs');

const cloneRepo = async (args) => {
    const repoURLParts = args.repo.split('/');
    const repoParts = repoURLParts[repoURLParts.length - 1].split('.');
    const repoName = repoParts[0];

    const workdir = await IPC.call('getStore', {key: 'workdir'});
    fs.mkdirSync(workdir, {recursive: true});

    const git = simpleGit(workdir);
    git.clone(args.repo);
    return repoName;
}

module.exports = cloneRepo;