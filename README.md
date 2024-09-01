# THEMING

## Option #1:

### files needed:

The app will read the following files, and use them at the exact images dimensions they are (this keeps you from having to specify sizing in the config file):

- `background.(png|jpg|gif)` (The main image, this will determine the size of the window, no images should be positioned outside the bounds of this image. If you need button images overhanging, add transparent padding to this image)
- `close.(png|jpg|gif)` (will close the window)
- `minimize.(png|jpg|gif)` (will minimize the window)
- `play.(png|jpg|gif)` (play and pause must be the same dimensions, as they will be swapped based on play/pause state)
- `pause.(png|jpg|gif)` (play and pause must be the same dimensions, as they will be swapped based on play/pause state)
- `previous.(png|jpg|gif)` (will skip to the previous track)
- `next.(png|jpg|gif)` (will skip to the next track)

### optional files:

- `closePressed.(png|jpg|gif)` (Each "pressed" image should be the same size as the normal image, as it will be positioned the same as the normal image)
- `minimizePressed.(png|jpg|gif)`
- `playPressed.(png|jpg|gif)`
- `pausePressed.(png|jpg|gif)`
- `previousPressed.(png|jpg|gif)`
- `nextPressed.(png|jpg|gif)`
- `font.ttf` (optional, if included, all text fields will use this font)

Some notes about the text fields:

- Any text field without a specified color or size will use the `fontColor` and `fontSize` from the config file.
- Any text field without a specified width will use the `textWidth` from the config file.
- Text field height is determined by the font size, but width must be specified in the config file.
- Any text that is too long for the field will automatically marquee (animated scroll left)
- The fields:
  - app (What app the music is coming from, i.e. Spotify, Apple Music)
  - artist (The artist of the song)
  - track (The song currently playing)
  - album (The album the song is from)

config.json:

- all numbers are in px from the top left corner of the screen, colors are hex strings
- A sample config file that you can make a copy of is in this repository.

```
{
  "themeName": string,
  "themeDesigner": string,
  "closeX": number,
  "closeY": number,
  "minimizeX": number,
  "minimizeY": number,
  "playPauseX": number,
  "playPauseY": number,
  "previousX": number,
  "previousY": number,
  "nextX": number,
  "nextY": number,
  "appX": number,
  "appY": number,
  "artistX": number,
  "artistY": number,
  "trackX": number,
  "trackY": number,
  "albumX": number,
  "albumY": number,
// Optional fields:
  "fontSize": number,
  "fontColor": string (hex),
  "textWidth": number,
  "appFontSize": number,
  "appFontColor": string (hex),
  "appTextWidth": number,
  "artistFontSize": number,
  "artistFontColor": string (hex),
  "artistTextWidth": number,
  "trackFontSize": number,
  "trackFontColor": string (hex),
  "trackTextWidth": number,
  "albumFontSize": number,
  "albumFontColor": string (hex),
  "albumTextWidth": number,
}
```

<!-- ## Option #2:

index.html:

- must have buttons with ids: close, minimize, playpause, previous, next (note, that playpause button will be autopopulated with a play or pause class name)
- must have text elements with ids: app, artist, track, album

you may include any other elements you want
you may include any other css you want
you may include any other js you want (must be reviewed for security) -->
