// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: set ts=2 sw=2 et ai :

/*
  Container Tab Groups
  Copyright (C) 2022 Menhera.org

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* eslint-env es2020, node */

/*
  Run with `make` and `npm run build`
*/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const child_process = require('child_process');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const package = require('../package.json');

const NAME = package.name;
const VERSION = package.version;

/**
 * Runs command asynchronously
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<string>}
 */
const runCommand = async (command, args) => {
  return new Promise((resolve, reject) => {
    try {
      child_process.execFile(command, args, (error, stdout, stderr) => {
        const stderrTrimmed = stderr.trim();
        if (stderrTrimmed) {
          console.warn(stderrTrimmed);
        }
        if (error) {
          reject(error);
        }
        resolve(stdout);
      });
    } catch (error) {
      reject(error);
    }
  });
};

runCommand('git', ['rev-parse', 'HEAD']).then((stdout) => {
  const hash = stdout.trim();
  return `${NAME}_${VERSION}-${hash}.prod.xpi`;
}).catch((error) => {
  console.error(error);
  return `${NAME}_${VERSION}.prod.xpi`;
}).then((filename) => {
  console.log(`Building ${filename}`);
  return runCommand('npx', ['web-ext', 'build', '--source-dir', './dist/', '--artifacts-dir', './builds/', '--overwrite-dest', '--filename', filename]);
}).then((stdout) => {
  console.log(stdout);
}).catch((error) => {
  console.error(error);
});
