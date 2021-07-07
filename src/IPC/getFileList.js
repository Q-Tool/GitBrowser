const fs = require('fs');
const path = require('path');
const IPC = require('./index');

const { promisify } = require('util');
const {resolve} = path;
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir, parentObject = null) {
    if(parentObject){
        const subDirs = await readdir(dir);

        await Promise.all(subDirs.map(async subdir => {
            const res = resolve(dir, subdir);
            const status = await stat(res);
            if(!parentObject.children){
                parentObject.children = [];
            }

            if(status.isDirectory()){
                const newParent = {
                    isDirectory: true,
                    parentDirectory: dir,
                    path: res,
                    name: path.basename(res),
                    size: status.size
                };
                parentObject.children.push(newParent)
                await getFiles(res, newParent);
            } else {
                parentObject.children.push({
                    isDirectory: false,
                    parentDirectory: dir,
                    path: res,
                    name: path.basename(res),
                    size: status.size
                })
            }

            return parentObject;
        }));
        return parentObject;
    } else {
        return await getFiles(dir, {
            isDirectory: true,
            parentDirectory: path.dirname(dir),
            path: dir,
            name: path.basename(dir),
        });
    }


}

const getFileList = async (args) => {
    const repo = args.repo;
    const workdir = await IPC.getStore({key: 'workdir'});
    return await getFiles(path.join(workdir, repo));
}

module.exports = getFileList;