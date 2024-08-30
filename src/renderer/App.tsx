import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';

interface MediaInfo {
  app: string;
  artist?: string;
  track: string;
  state: 'playing' | 'paused' | 'stopped';
}

function Main() {
  const [trackInfo, setTrackInfo] = useState<MediaInfo | null>(null);
  useEffect(() => {
    window.electron.ipcRenderer.on('track-update', (event: any) => {
      console.log(event);
      setTrackInfo(event);
    });
  }, []);
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('window-control', 'close')
        }
      >
        close
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('window-control', 'minimize')
        }
      >
        minimize
      </button>
      <p>{trackInfo?.app}</p>
      <p>{trackInfo?.artist}</p>
      <p>{trackInfo?.track}</p>
      <p>{trackInfo?.state}</p>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('media-control', 'playPause')
        }
      >
        Play
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('media-control', 'playPause')
        }
      >
        Pause
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('media-control', 'next')
        }
      >
        Next
      </button>
      <button
        type="button"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('media-control', 'previous')
        }
      >
        Previous
      </button>
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
