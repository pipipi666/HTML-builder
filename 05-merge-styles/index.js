const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const writeStream = fs.createWriteStream(
  path.join(__dirname, "/project-dist/bundle.css")
);

async function bundle() {
  try {
    const files = await fsp.readdir(path.join(__dirname, "/styles"));
    for (const file of files) {
      const name = path.join(__dirname, "/styles", file);
      const stat = await fsp.stat(name);
      if (stat.isFile() && path.extname(name) === ".css") {
        const readStream = fs.createReadStream(name);
        readStream.on("data", function (res) {
          writeStream.write(res.toString());
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

bundle();
