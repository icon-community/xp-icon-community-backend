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
