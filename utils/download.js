const download = require('download-git-repo');
const path = require('path');
const fs = require('fs-extra');

const { logWithSpinner, stopSpinner } = require('../utils');

module.exports = (repository, targetDir) => {
  return new Promise(async (resolve, reject) => {
    const userTmpdir = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
    const tmpdir = path.join(userTmpdir, targetDir)
    console.log('tempdir: ', tmpdir);
    await fs.remove(tmpdir);
    logWithSpinner('download-template', '正在下载模板...');
    download(repository, tmpdir, { clone: true }, err => {
      stopSpinner();
      if (err) {
        reject(err);
      } else {
        resolve(tmpdir);
      }
    })
  })
}
