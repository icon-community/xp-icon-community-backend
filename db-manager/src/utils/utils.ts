import * as fs from 'fs';
import * as path from 'path';

/**
 * Search to see if a tag exists in any of the log files.
 * @param tag The tag to search for.
 */
export function isTagInLogs(tag: string, folderPath: string = ''): boolean {
  // Directory where log files are stored
  const directory = path.join(
    __dirname,
    folderPath === '' ? 'logs' : folderPath,
  );

  try {
    const logFiles = fs
      .readdirSync(directory)
      .filter((file) => file.endsWith('.log')); // Adjust extension if necessary

    for (const file of logFiles) {
      const filePath = path.join(directory, file);
      const data = fs.readFileSync(filePath, 'utf-8');

      const matchingLines = data
        .split('\n')
        .filter((line) => line.includes(`${tag}`)); // Checks if the tag exists in the line

      if (matchingLines.length > 0) {
        return true;
      }
    }
  } catch (error) {
    // console.error('Error reading log files:', error);
    void error;
    return false;
  }
  return false;
}

/**
 * This function is used to get the full path of a file or folder in the project.
 * It is used to avoid using relative paths in the project.
 * It works by finding the main folder of the project and then calculating the path from there.
 * @param relativePath The path of the file or folder relative to the main folder of the project.
 * @returns The full path of the file or folder.
 */
export function customPath(relativePath: string): string {
  const fullPath = path.dirname(require.main.filename);
  const fullPathArray = fullPath.split('/');
  fullPathArray[0] = '/';
  let MAIN_FOLDER = null;

  let maxLoops = 100;
  while (MAIN_FOLDER === null && maxLoops > 0) {
    maxLoops--;
    const folderPath = path.join(...fullPathArray);
    const packageJsonPath = path.join(folderPath, 'package.json');
    try {
      fs.accessSync(packageJsonPath, fs.constants.F_OK);
      const folderSplit = folderPath.split('/');
      MAIN_FOLDER = folderSplit[folderSplit.length - 1];
    } catch (err) {
      void err;
      fullPathArray.pop();
    }
  }
  const parsedPath = path.parse(__filename);
  const fullPathSplit = parsedPath.dir.split('/');

  while (fullPathSplit.length > 0) {
    if (fullPathSplit[fullPathSplit.length - 1] === MAIN_FOLDER) {
      break;
    } else {
      fullPathSplit.pop();
    }
  }
  fullPathSplit.push(relativePath);

  return fullPathSplit.join('/');
}
