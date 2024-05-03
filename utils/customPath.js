// customPath.js
//
const path = require("path");

const fullPath = path.parse(__filename).dir;
const fullPathArray = fullPath.split("/");
const MAIN_FOLDER = fullPathArray[fullPathArray.length - 2];

function customPath(relativePath) {
  const parsedPath = path.parse(__filename);
  let fullPathSplit = parsedPath.dir.split("/");

  for (let i = 0; i < fullPathSplit.length; i++) {
    if (fullPathSplit[fullPathSplit.length - 1] === MAIN_FOLDER) {
      break;
    } else {
      fullPathSplit.pop();
    }
  }
  fullPathSplit.push(relativePath);

  return fullPathSplit.join("/");
}

if (require.main === module) {
  // if the file gets called directly from the terminal
  let testPath = fullPath.split("/");
  testPath.pop();
  testPath = testPath.join("/");
  console.log(
    `Running ${path.parse(__filename).base} file directly from terminal\n`,
  );

  console.log(
    `the module customPath.js works by assuming that it is placed in a folder inside the main project folder, usually a folder named "service" but it doesnt matter the name.\nFor this run customPath is assuming that the main folder is "${MAIN_FOLDER}".\n\nIf the following 2 paths doesnt match then customPath.js will not work properly.\nTrue path: ${
      testPath + "/TEST"
    }\nCalculated by customPath.js: ${customPath("TEST")}.`,
  );
} else {
  // if the file gets imported as a module
  console.log(`${path.parse(__filename).base} file imported as a module`);
  module.exports = customPath;
}
