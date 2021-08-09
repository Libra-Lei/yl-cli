const download = require('download-git-repo');
const path = require('path');

module.exports = (targetDir) => {
  return new Promise((resolve, reject) => {
    const userTmpdir = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
    const tempdir = path.join(userTmpdir, targetDir)
    console.log('tempdir: ', tempdir);
  })
}
