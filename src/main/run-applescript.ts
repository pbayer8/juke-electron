// Pulled from NPM package https://www.npmjs.com/package/run-applescript

import { execFile } from 'node:child_process';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export default async function runAppleScript(
  script: string,
  // { humanReadableOutput = true } = {},
) {
  if (process.platform !== 'darwin') {
    throw new Error('macOS only');
  }

  // const outputArguments = humanReadableOutput ? [] : ['-ss'];
  try {
    const { stdout } = await execFileAsync('osascript', [
      '-e',
      script,
      // ...outputArguments,
    ]);
    return stdout.trim();
  } catch (e) {
    console.error(e);
    // throw new Error('Failed to run AppleScript.');
  }
  return null;
}
