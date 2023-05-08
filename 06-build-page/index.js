const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const reg = /{{\w+}}/g;

let template = '';
let tmpComponents = [];
let files = [];

fsp.mkdir(path.join(__dirname, '/project-dist'), { recursive: true });

async function readComponents() {
  return await fsp.readdir(path.join(__dirname, '/components'));
}

async function replaceComponent() {
  let tmp = template;
  files.forEach(async (file) => {
    const namePath = path.join(__dirname, '/components', file);
    const stat = await fsp.stat(namePath);
    const name = path
      .basename(namePath)
      .slice(0, path.basename(namePath).lastIndexOf(path.extname(namePath)));
    if (
      stat.isFile() &&
      path.extname(namePath) === '.html' &&
      tmpComponents.includes(name)
    ) {
      const readStream = fs.createReadStream(namePath);
      readStream.on('data', function (res) {
        tmp = tmp.replace(`{{${name}}}`, res.toString());
        const writeStream = fs.createWriteStream(
          path.join(__dirname, '/project-dist/index.html')
        );
        writeStream.write(tmp);
      });
    }
  });
}

const readStream = fs.createReadStream(path.join(__dirname, '/template.html'));

readStream.on('data', async function (res) {
  files = await readComponents();
  template = res.toString();
  const arr = template.match(reg);
  for (const component of arr) {
    const tag = component.replace('{{', '').replace('}}', '').trim();
    tmpComponents.push(tag);
  }
  replaceComponent();
  bundleStyles();
});

const stylesWriteStream = fs.createWriteStream(
  path.join(__dirname, '/project-dist/style.css')
);

async function bundleStyles() {
  try {
    let files = await fsp.readdir(path.join(__dirname, '/styles'));
    for (const file of files) {
      const name = path.join(__dirname, '/styles', file);
      const stat = await fsp.stat(name);
      if (stat.isFile() && path.extname(name) === '.css') {
        const readStream = fs.createReadStream(name);
        readStream.on('data', function (res) {
          stylesWriteStream.write(res.toString());
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

const dir = path.join(__dirname, '/assets');
const copyDir = path.join(__dirname, '/project-dist/assets');

async function copy(src, dest) {
  try {
    const files = await fsp.readdir(src);
    for (const file of files) {
      const name = path.join(src, file);
      const copyName = path.join(dest, file);
      const stat = await fsp.stat(name);
      if (stat.isFile()) {
        fs.copyFile(name, copyName, fs.constants.COPYFILE_FICLONE, (err) => {
          if (err) throw err;
        });
      } else {
        fsp.mkdir(path.join(dest, '/', file), { recursive: true });
        copy(path.join(src, '/', file), path.join(dest, '/', file));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

copy(dir, copyDir);
