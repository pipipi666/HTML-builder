const fs = require("fs");
const path = require("node:path");

const readStream = fs.createReadStream(path.join(__dirname, "/text.txt"));

readStream.on("data", function (res) {
  console.log(res.toString());
});
