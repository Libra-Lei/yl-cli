#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { chalk, error, stopSpinner } = require('../utils');
const download = require('../utils/download')

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd();
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || '.');
  
  console.log('[当前路径]: ', name, targetDir);

  if (inCurrent) {
    const { ok } = await inquirer.prompt([
      {
        name: '确认',
        type: 'confirm',
        message: `确认要在当前目录下创建工程吗?`
      }
    ])
    if (!ok) {
      return
    }
  } else {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `如果目标文件夹 ${chalk.cyan(targetDir)} 已经存在。 请选择后续操作:`,
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '取消', value: false }
        ]
      }
    ])
    if (!action) {
      return
    } else if (action === 'overwrite') {
      console.log(`\n正在删除 ${chalk.cyan(targetDir)}...`)
      await fs.remove(targetDir)
    }
  }

  download(name);
  console.log('来了.....');
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
  });
}
