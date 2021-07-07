const fs = require('fs');

const getFileContent = async (args) => {
    return fs.readFileSync(args.file, 'utf8')
}

module.exports = getFileContent;