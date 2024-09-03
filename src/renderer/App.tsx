import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Image, Theme } from '../main/theme-parser';
import { MediaInfo } from '../main/types';
import './App.css';
import Button from './Button';
import { parseBlob } from './file-parser';
import { Text } from './Text';

function Main() {
  const [trackInfo, setTrackInfo] = useState<MediaInfo | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const handleTrackUpdate = (...args: unknown[]) => {
      const event = args[0] as MediaInfo;
      setTrackInfo(event);
    };
    window.electron.ipcRenderer.on('track-update', handleTrackUpdate);
    window.electron.ipcRenderer.on('theme-update', (event) => {
      setTheme(event as Theme);
    });
  }, []);

  useEffect(() => {
    if (theme?.font) {
      const fontUrl = parseBlob(theme.font, 'font/ttf');
      const fontFace = new FontFace('CustomFont', `url(${fontUrl})`);

      fontFace
        .load()
        .then((loadedFace) => document.fonts.add(loadedFace))
        .catch((error) => {
          console.error('Error loading font:', error);
        });

      return () => {
        URL.revokeObjectURL(fontUrl);
      };
    }
    return () => {};
  }, [theme?.font]);

  if (!theme) return null;

  const getImageSrc = (imageData: Image) =>
    parseBlob(imageData?.data, `image/${imageData.extension}`);

  const sendMessage = (channel: string, message: string) => () =>
    window.electron.ipcRenderer.sendMessage(channel, message);
  return (
    <div
      style={{
        fontFamily: theme.font ? 'CustomFont, sans-serif' : 'sans-serif',
      }}
    >
      <img
        src={getImageSrc(theme.images.background)}
        alt="background"
        id="background"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <Button
        onClick={sendMessage('window-control', 'close')}
        imageSrc={getImageSrc(theme.images.close)}
        alt="close"
        x={theme.config.closeX}
        y={theme.config.closeY}
      />
      <Button
        onClick={sendMessage('window-control', 'minimize')}
        imageSrc={getImageSrc(theme.images.minimize)}
        alt="minimize"
        x={theme.config.minimizeX}
        y={theme.config.minimizeY}
      />
      <Button
        onClick={sendMessage('media-control', 'playPause')}
        imageSrc={getImageSrc(
          trackInfo?.state === 'playing'
            ? theme.images.pause
            : theme.images.play,
        )}
        alt="playPause"
        x={theme.config.playPauseX}
        y={theme.config.playPauseY}
      />
      <Button
        onClick={sendMessage('media-control', 'next')}
        imageSrc={getImageSrc(theme.images.next)}
        alt="next"
        x={theme.config.nextX}
        y={theme.config.nextY}
      />
      <Button
        onClick={sendMessage('media-control', 'previous')}
        imageSrc={getImageSrc(theme.images.previous)}
        alt="previous"
        x={theme.config.previousX}
        y={theme.config.previousY}
      />
      {trackInfo && (
        <>
          <Text
            text={trackInfo.app}
            config={{
              x: theme.config.appX,
              y: theme.config.appY,
              textWidth: theme.config.appTextWidth,
              fontSize: theme.config.appFontSize,
              fontColor: theme.config.appFontColor,
            }}
            theme={theme}
          />
          <Text
            text={trackInfo.artist || ''}
            config={{
              x: theme.config.artistX,
              y: theme.config.artistY,
              textWidth: theme.config.artistTextWidth,
              fontSize: theme.config.artistFontSize,
              fontColor: theme.config.artistFontColor,
            }}
            theme={theme}
          />
          <Text
            text={trackInfo.track}
            config={{
              x: theme.config.trackX,
              y: theme.config.trackY,
              textWidth: theme.config.trackTextWidth,
              fontSize: theme.config.trackFontSize,
              fontColor: theme.config.trackFontColor,
            }}
            theme={theme}
          />
          <Text
            text={trackInfo.album || ''}
            config={{
              x: theme.config.albumX,
              y: theme.config.albumY,
              textWidth: theme.config.albumTextWidth,
              fontSize: theme.config.albumFontSize,
              fontColor: theme.config.albumFontColor,
            }}
            theme={theme}
          />
        </>
      )}
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
