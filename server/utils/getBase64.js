const fs = require("fs");

// Convert input file into base64 (mainly for uploading to imgbb)
// NOTE: The result does not come with prefix "data:image/png;base64,"
const getBase64 = (file) => {
  const bitmap = fs.readFileSync(file)
  return Buffer.from(bitmap).toString("base64")
}

module.exports = getBase64