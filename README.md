### THEMING

## Option #1:

# files needed:

background.(png|jpg|gif)
close.(png|jpg|gif)
minimize.(png|jpg|gif)
play.(png|jpg|gif)
pause.(png|jpg|gif)
previous.(png|jpg|gif)
next.(png|jpg|gif)

# optional files:

closePressed.(png|jpg|gif)
minimizePressed.(png|jpg|gif)
playPressed.(png|jpg|gif)
pausePressed.(png|jpg|gif)
previousPressed.(png|jpg|gif)
nextPressed.(png|jpg|gif)
font.ttf

config.json (all numbers are in px from the top left corner of the screen, colors are hex):
{
closeX: number,
closeY: number,
minimizeX: number,
minimizeY: number,
playPauseX: number,
playPauseY: number,
previousX: number,
previousY: number,
nextX: number,
nextY: number,
appX: number,
appY: number,
artistX: number,
artistY: number,
trackX: number,
trackY: number,
albumX: number,
albumY: number,
// Optional fields:
fontSize: number,
fontColor: string (hex),
textWidth: number,
appFontSize: number,
appFontColor: string (hex),
appTextWidth: number,
artistFontSize: number,
artistFontColor: string (hex),
artistTextWidth: number,
trackFontSize: number,
trackFontColor: string (hex),
trackTextWidth: number,
albumFontSize: number,
albumFontColor: string (hex),
albumTextWidth: number,
}

# optional files:

closePressed.(png|jpg|gif)
minimizePressed.(png|jpg|gif)
playPressed.(png|jpg|gif)
pausePressed.(png|jpg|gif)
previousPressed.(png|jpg|gif)
nextPressed.(png|jpg|gif)
font.ttf

## Option #2:

index.html:

- must have buttons with ids: close, minimize, playpause, previous, next (note, that playpause button will be autopopulated with a play or pause class name)
- must have text elements with ids: app, artist, track, album

you may include any other elements you want
you may include any other css you want
you may include any other js you want (must be reviewed for security)
