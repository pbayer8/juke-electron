import { execSync } from 'child_process';
import { ipcMain } from 'electron';

interface MediaInfo {
  app: string;
  artist?: string;
  track: string;
  album?: string;
  state: 'playing' | 'paused' | 'stopped';
}

let mediaInfo: MediaInfo | null = null;
let callback: (info: MediaInfo) => void;
interface MediaApp {
  name: string;
  getInfo: () => string;
  playPause: string;
  next: string | null;
  previous: string | null;
}

const TOKEN_SEPARATOR = '|||';

const mediaApps: MediaApp[] = [
  {
    name: 'Music',
    getInfo: () => `
      if application "Music" is running then
        tell application "Music"
          set playerState to (get player state) as string
          if playerState is not "stopped" then
            return "Music${TOKEN_SEPARATOR}" & artist of current track & "${TOKEN_SEPARATOR}" & name of current track & "${TOKEN_SEPARATOR}" & album of current track & "${TOKEN_SEPARATOR}" & playerState
          end if
        end tell
      end if
    `,
    playPause:
      'if application "Music" is running then tell application "Music" to playpause',
    next: 'if application "Music" is running then tell application "Music" to next track',
    previous:
      'if application "Music" is running then tell application "Music" to previous track',
  },
  {
    name: 'Spotify',
    getInfo: () => `
      if application "Spotify" is running then
        tell application "Spotify"
          set playerState to (get player state) as string
          if playerState is not "stopped" then
            return "Spotify${TOKEN_SEPARATOR}" & artist of current track & "${TOKEN_SEPARATOR}" & name of current track & "${TOKEN_SEPARATOR}" & album of current track & "${TOKEN_SEPARATOR}" & playerState
          end if
        end tell
      end if
    `,
    playPause:
      'if application "Spotify" is running then tell application "Spotify" to playpause',
    next: 'if application "Spotify" is running then tell application "Spotify" to next track',
    previous:
      'if application "Spotify" is running then tell application "Spotify" to previous track',
  },
  {
    name: 'QuickTime Player',
    getInfo: () => `
      if application "QuickTime Player" is running then
        tell application "QuickTime Player"
          if (count of documents) > 0 then
            set currentDoc to document 1
            set playerState to "paused"
            if playing of currentDoc then
              set playerState to "playing"
            end if
            return "QuickTime Player${TOKEN_SEPARATOR}${TOKEN_SEPARATOR}" & name of currentDoc & "${TOKEN_SEPARATOR}" & playerState
          end if
        end tell
      end if
    `,
    playPause:
      'if application "QuickTime Player" is running then tell application "QuickTime Player" to play the front document',
    next: null,
    previous: null,
  },
  // {
  //   name: 'VLC',
  //   getInfo: () => `
  //     if application "VLC" is running then
  //       tell application "System Events"
  //         if exists (process "VLC") then
  //           tell application "VLC"
  //             set playerState to "paused"
  //             if playing then
  //               set playerState to "playing"
  //             end if
  //             return "VLC${TOKEN_SEPARATOR}${TOKEN_SEPARATOR}" & name of current item & "${TOKEN_SEPARATOR}" & playerState
  //           end tell
  //         end if
  //       end tell
  //     end if
  //   `,
  //   playPause:
  //     'if application "VLC" is running then tell application "VLC" to play',
  //   next: 'if application "VLC" is running then tell application "VLC" to next',
  //   previous:
  //     'if application "VLC" is running then tell application "VLC" to previous',
  // },
];
const genericMediaControls = {
  playPause:
    'tell application "System Events" to key code 16 using {command down, option down}',
  next: 'tell application "System Events" to key code 17 using {command down, option down}',
  previous:
    'tell application "System Events" to key code 18 using {command down, option down}',
};
function parseMediaInfo(result: string): MediaInfo | null {
  const [app, artist, track, album, state] = result.split(TOKEN_SEPARATOR);
  mediaInfo = {
    app,
    artist: artist || undefined,
    track,
    album: album || undefined,
    state: state as 'playing' | 'paused' | 'stopped',
  };
  if (app && state) {
    return mediaInfo;
  }
  return null;
}
function runAppleScript(script: string): string | null {
  try {
    return execSync(`osascript -e '${script}'`, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('AppleScript Error:', error);
    return null;
  }
}

export function updateTrackInfo() {
  const script = `
    ${mediaApps.map((app) => app.getInfo()).join('\n')}
    return ""
  `;

  const result = runAppleScript(script);
  if (result && result !== '') {
    parseMediaInfo(result);
    if (mediaInfo && callback) {
      callback(mediaInfo);
    }
  }
}

export function setupMediaControls(cb: (info: MediaInfo) => void) {
  callback = cb;
  updateTrackInfo();
  setInterval(() => {
    updateTrackInfo();
  }, 5000);
}

ipcMain.on(
  'media-control',
  (event, action: 'playPause' | 'next' | 'previous') => {
    const { app: appName } = mediaInfo || {};
    const app = mediaApps.find((a) => a.name === appName);
    if (app && app[action]) {
      runAppleScript(app[action] as string);
      // Update track info immediately after a control action
      setTimeout(updateTrackInfo, 500);
    } else {
      runAppleScript(genericMediaControls[action]);
    }
  },
);
