// customPath.js
//
const path = require("path");
const fs = require("fs");

const fullPath = path.dirname(require.main.filename);
let fullPathArray = fullPath.split("/");
fullPathArray[0] = "/";
let MAIN_FOLDER = null;

let maxLoops = 100;
while (MAIN_FOLDER === null && maxLoops > 0) {
  maxLoops--;
  const folderPath = path.join(...fullPathArray);
  const packageJsonPath = path.join(folderPath, "package.json");
  // console.log("while loop");
  // console.log(fullPathArray);
  // console.log(maxLoops);
  // console.log(packageJsonPath);
  try {
    fs.accessSync(packageJsonPath, fs.constants.F_OK);
    const folderSplit = folderPath.split("/");
    MAIN_FOLDER = folderSplit[folderSplit.length - 1];
    console.log(`package.json found in ${folderPath}`);
  } catch (err) {
    void err;
    // console.log(`no package.json found in ${folderPath}`);
    fullPathArray.pop();
  }
}

function customPath(relativePath) {
  const parsedPath = path.parse(__filename);
  let fullPathSplit = parsedPath.dir.split("/");
  // fullPathSplit[0] = "/";

  while (fullPathSplit.length > 0) {
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
