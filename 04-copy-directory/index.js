const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const dir = path.join(__dirname, "/files");
const copyDir = path.join(__dirname, "/files-copy");

fsp.mkdir(copyDir, { recursive: true });

async function copy() {
  try {
    const files = await fsp.readdir(dir);
    for (const file of files) {
      const name = path.join(dir, file);
      const copyName = path.join(copyDir, file);
      fs.copyFile(name, copyName, fs.constants.COPYFILE_FICLONE, (err) => {
        if (err) throw err;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

copy();
