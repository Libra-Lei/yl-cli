const MetalSmith = require('metalsmith');
const { promisify } = require('util');
let { render } = require('consolidate').ejs;
render = promisify(render);

module.exports = (targetDir, tmpDir, settings) => {
  return new Promise((resolve, reject) => {
    MetalSmith(process.cwd())
      .source(tmpDir)
      .destination(targetDir)
      .use((files, metadata, done) => {
        Reflect.ownKeys(files).forEach(async file => {
          // TODO: 目前只处理 package.json
          if (file.includes('json')) {
            let content = files[file].contents.toString();
            content = await render(content, settings);
            files[file].contents = Buffer.from(content);
          }
        })
        done();
      })
      .build(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
  })
}
