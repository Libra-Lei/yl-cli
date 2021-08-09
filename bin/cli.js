#!/usr/bin/env node
const { semver, chalk } = require('../utils');
const targetVersion = require('../package.json').engines.node;

// Node 版本检查
function checkNodeVersion (target, name) {
  if (
    !semver.satisfies(process.version, target, { includePrerelease: true })
  ) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${name} requires Node wanted ${target}.\nPlease upgrade your Node version.`
      )
    );
    process.exit(1);
  }
}

checkNodeVersion(targetVersion, '@libra-lei/cli');

// 命令处理
const minimist = require('minimist');
const program = require('commander');

program
  .version(`@libra-lei/cli ${require('../package.json').version}`)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('创建一个新的项目')
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow(
        `你提供的参数超过了1个，第一个参数将用作项目名称，其余的参数会被忽略`
      ))
    }
    require('../lib/create')(name, options);
  })

program.parse(process.argv);
