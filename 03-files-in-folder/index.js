const fs = require("node:fs/promises");
const path = require("node:path");

const pathsToCheck = path.join(__dirname, "/secret-folder");

async function print() {
  try {
    const files = await fs.readdir(pathsToCheck);
    for (const file of files) {
      const name = path.join(__dirname, "/secret-folder", file);
      const stat = await fs.stat(name);
      if (stat.isFile()) {
        console.log(
          `${path
            .basename(name)
            .slice(
              0,
              path.basename(name).lastIndexOf(path.extname(name))
            )} - ${path.extname(name).slice(1)} - ${stat.size / 1024}kb`
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

print();
