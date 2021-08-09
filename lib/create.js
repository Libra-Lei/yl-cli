#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const { chalk, error, stopSpinner, log } = require('../utils');
const download = require('../utils/download');
const askSettings = require('../utils/ask-settings');
const templatesRepository = require('../utils/template-repository');
const renderTemplate = require('../utils/render-template');

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

  // 选择模板
  const { repository } = await inquirer.prompt([
    {
      name: 'repository',
      type: 'list',
      message: `请选择模板：`,
      choices: templatesRepository
    }
  ])

  // 用户自定义配置
  const pkgSettings = await askSettings();

  // 下载模板
  const tmpDir = await download(repository, name);

  // 渲染模板
  await renderTemplate(targetDir, tmpDir, pkgSettings);

  // 渲染完成
  log()
  log(`🎉  创建工程 ${chalk.yellow(name)} 成功！`);
  log(
    `👉  你可以通过以下命令开始工程:\n\n` +
    chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`) +
    chalk.cyan(` ${chalk.gray('$')} npm run dev`)
  );
  log();
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
  });
}
