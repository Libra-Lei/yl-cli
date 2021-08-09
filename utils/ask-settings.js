const inquirer = require('inquirer');

module.exports = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'pkgName',
      type: 'input',
      message: `请输入项目名称（默认：yl-vue-template）:`
    },
    {
      name: 'pkgVersion',
      type: 'input',
      message: `请输入版本号（默认：1.0.0）:`
    },
    {
      name: 'pkgAutor',
      type: 'input',
      message: `请输作者（默认：''）:`
    },
    {
      name: 'pkgDesc',
      type: 'input',
      message: `请输工程描述（默认：''）:`
    },
    {
      name: 'pkgLicense',
      type: 'input',
      message: `请输工程协议（默认：ISC）:`
    }
  ])
  return {
    pkgName: answers.pkgName || 'yl-vue-template',
    pkgVersion: answers.pkgVersion || '1.0.0',
    pkgAutor: answers.pkgAutor || '',
    pkgDesc: answers.pkgDesc || '',
    pkgLicense: answers.pkgLicense || 'ISC'
  };
}
