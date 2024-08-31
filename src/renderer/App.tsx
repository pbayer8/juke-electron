import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Theme } from '../main/theme-parser';
import './App.css';
import { parseBlob } from './file-parser';

// TODO: ask to make loops and less redundant
// TODO: css make no images draggable
// TODO: hover and pressed effects

interface MediaInfo {
  app: string;
  artist?: string;
  track: string;
  album?: string;
  state: 'playing' | 'paused' | 'stopped';
}

function Main() {
  const [trackInfo, setTrackInfo] = useState<MediaInfo | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const themePath = 'frog'; // You can make this configurable
  useEffect(() => {
    window.electron.ipcRenderer.on('track-update', (event: any) => {
      setTrackInfo(event);
    });
    window.electron.ipcRenderer
      .getTheme(themePath)
      .then((t: Theme) => {
        setTheme(t);
        return t;
      })
      .catch((e) => console.error(e));
  }, []);
  return (
    // TODO: pressed images
    <div
      style={{
        font: theme?.font ? parseBlob(theme?.font, 'font/ttf') : 'sans-serif',
      }}
    >
      <img
        src={parseBlob(
          theme?.images?.background?.data!,
          `image/${theme?.images.background.extension}`,
        )}
        alt="background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('window-control', 'close')
        }
        style={{
          top: `${theme?.config?.closeY}px`,
          left: `${theme?.config?.closeX}px`,
        }}
      >
        <img
          src={parseBlob(
            theme?.images?.close?.data!,
            `image/${theme?.images.close.extension}`,
          )}
          alt="close"
        />
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('window-control', 'minimize')
        }
        style={{
          top: `${theme?.config?.minimizeY}px`,
          left: `${theme?.config?.minimizeX}px`,
        }}
      >
        <img
          src={parseBlob(
            theme?.images?.minimize?.data!,
            `image/${theme?.images.background.extension}`,
          )}
          alt="minimize"
        />
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('media-control', 'playPause')
        }
        style={{
          top: `${theme?.config?.playPauseY}px`,
          left: `${theme?.config?.playPauseX}px`,
        }}
      >
        <img
          src={parseBlob(
            trackInfo?.state === 'playing'
              ? theme?.images?.pause?.data!
              : theme?.images?.play?.data!,
            `image/${theme?.images.background.extension}`,
          )}
          alt="playPause"
        />
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('media-control', 'next')
        }
        style={{
          top: `${theme?.config?.nextY}px`,
          left: `${theme?.config?.nextX}px`,
        }}
      >
        <img
          src={parseBlob(
            theme?.images?.next?.data!,
            `image/${theme?.images.background.extension}`,
          )}
          alt="next"
        />
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('media-control', 'previous')
        }
        style={{
          top: `${theme?.config?.previousY}px`,
          left: `${theme?.config?.previousX}px`,
        }}
      >
        <img
          src={parseBlob(
            theme?.images?.previous?.data!,
            `image/${theme?.images.background.extension}`,
          )}
          alt="previous"
        />
      </button>
      {/* TODO: Marquee */}
      <p
        style={{
          top: `${theme?.config?.appY}px`,
          left: `${theme?.config?.appX}px`,
          width: `${theme?.config?.appTextWidth}px`,
          fontSize: `${theme?.config?.appFontSize || theme?.config?.fontSize || 12}px`,
          color:
            theme?.config?.appFontColor ||
            theme?.config?.fontColor ||
            '#000000',
        }}
      >
        {trackInfo?.app}
      </p>
      <p
        style={{
          top: `${theme?.config?.artistY}px`,
          left: `${theme?.config?.artistX}px`,
          width: `${theme?.config?.artistTextWidth}px`,
          fontSize: `${theme?.config?.artistFontSize || theme?.config?.fontSize || 12}px`,
          color:
            theme?.config?.artistFontColor ||
            theme?.config?.fontColor ||
            '#000000',
        }}
      >
        {trackInfo?.artist}
      </p>
      <p
        style={{
          top: `${theme?.config?.trackY}px`,
          left: `${theme?.config?.trackX}px`,
          width: `${theme?.config?.trackTextWidth}px`,
          fontSize: `${theme?.config?.trackFontSize || theme?.config?.fontSize || 12}px`,
          color:
            theme?.config?.trackFontColor ||
            theme?.config?.fontColor ||
            '#000000',
        }}
      >
        {trackInfo?.track}
      </p>
      <p
        style={{
          top: `${theme?.config?.albumY}px`,
          left: `${theme?.config?.albumX}px`,
          width: `${theme?.config?.albumTextWidth}px`,
          fontSize: `${theme?.config?.albumFontSize || theme?.config?.fontSize || 12}px`,
          color:
            theme?.config?.albumFontColor ||
            theme?.config?.fontColor ||
            '#000000',
        }}
      >
        {trackInfo?.album}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
