// third party imports
const { fromEvent, NEVER } = require('rxjs');
const {
  map,
  flatMap,
  filter,
  repeat,
  tap,
  takeUntil,
  switchMap
} = require('rxjs/operators');

// local imports
const { moveImage } = require('./helpers/move-helpers');
const {
  log,
  logMsgAndReturnImg,
  processFile,
  createImg,
  renderImage,
  getImageById
} = require('./helpers/file-processing-helpers.js');
const {
  updateCanvasWidthHeightRatio,
  scaleToFitParent,
  scale
} = require('./helpers/scaling-helpers');

// *grab DOM elements inside index.html*
const fileSelector = document.getElementById('fileSelector');
const imageContainer = document.getElementById('imageContainer');
const generateButton = document.getElementById('generateButton');
const buttonUp = document.getElementById('button-up');
const buttonLeft = document.getElementById('button-left');
const buttonRight = document.getElementById('button-right');
const buttonDown = document.getElementById('button-down');
const scale50Button = document.getElementById('scale-50');
const scaleToFitButton = document.getElementById('scale-to-fit');
const scale200Button = document.getElementById('scale-200');

// *create streams from event we are interested in*
// we want to track change event from fileSelector
const onFileSelectorChange$ = fromEvent(fileSelector, 'change');
// we want track the resize event on window to track the current width...
// of the div#imageContainer and update the width of the <img> DOM element
const onResize$ = fromEvent(window, 'resize');
// we want to track mousedown events on <img> DOM element only
const down$ = element => fromEvent(element, 'mousedown');
// we want to track mousemove and mouseup events on document
const move$ = fromEvent(document, 'mousemove');
const up$ = fromEvent(document, 'mouseup');
// we want to track onload events (for FileReader, <img> DOM element etc.)
const onLoad$ = entity => fromEvent(entity, 'load');
// we want to track positioning and scaling buttons' clicks
const buttonUp$ = fromEvent(buttonUp, 'click');
const buttonLeft$ = fromEvent(buttonLeft, 'click');
const buttonRight$ = fromEvent(buttonRight, 'click');
const buttonDown$ = fromEvent(buttonDown, 'click');
const scale50Button$ = fromEvent(scale50Button, 'click');
const scaleToFitButton$ = fromEvent(scaleToFitButton, 'click');
const scale200Button$ = fromEvent(scale200Button, 'click');

// *functional reactive logic*

// update canvas' size on window resize events
onResize$
  .pipe(
    tap(_ => {
      if (imageContainer.childElementCount > 0) {
        updateCanvasWidthHeightRatio(imageContainer);
      }
    })
  )
  .subscribe();

// drag image to position it
const dragImg$ = photo =>
  // listen mousedown events on uploaded photo
  down$(photo).pipe(
    // track mousedown events from the left mouse button only
    filter(event => event.which === 1),
    // switch to listening mousemove events and update img offsets
    flatMap(event => {
      // get current mouse position
      let startX = event.clientX;
      let startY = event.clientY;

      return move$.pipe(
        tap(e => {
          const offsetX = e.clientX - startX;
          const offsetY = e.clientY - startY;
          moveImage(photo, offsetX, offsetY);
          startX = e.clientX;
          startY = e.clientY;
        })
      );
    }),
    // stop tracking mousemove events after mouseup
    takeUntil(up$),
    // resubscribe to the first step
    repeat()
  );

// upload an image and track mousedown events for positioning a photo
onFileSelectorChange$
  .pipe(
    // get file
    map(event => event.target.files[0]),
    // process file
    map(file => processFile(file)),
    // if uploaded file is an image, switch to listening FileReader events
    switchMap(reader => (reader ? onLoad$(reader) : NEVER)),
    // get image from FileReader
    map(event => event.target.result),
    // create <img> element
    map(result => createImg(result)),
    // add <img> element as a child to the #imageContainer
    map(img => renderImage(img, imageContainer)),
    // switch to listening img.onload event
    switchMap(element => onLoad$(element)),
    // log info about uploaded image
    map(event => logMsgAndReturnImg(event)),
    // switch listening mousedown events on uploaded photo
    switchMap(photo => dragImg$(photo))
  )
  .subscribe();

// move image with buttons

buttonUp$
  .pipe(
    tap(_ => {
      const img = getImageById();
      moveImage(img, 0, -10);
    })
  )
  .subscribe();

buttonLeft$
  .pipe(
    tap(_ => {
      const img = getImageById();
      moveImage(img, -10, 0);
    })
  )
  .subscribe();

buttonRight$
  .pipe(
    tap(_ => {
      const img = getImageById();
      moveImage(img, 10, 0);
    })
  )
  .subscribe();

buttonDown$
  .pipe(
    tap(_ => {
      const img = getImageById();
      moveImage(img, 0, 10);
    })
  )
  .subscribe();

// scale image

scaleToFitButton$
  .pipe(
    tap(_ => {
      const img = getImageById();
      scaleToFitParent(img);
    })
  )
  .subscribe();

scale50Button$
  .pipe(
    tap(_ => {
      const img = getImageById();
      scale(img, 50);
    })
  )
  .subscribe();

scale200Button$
  .pipe(
    tap(_ => {
      const img = getImageById();
      scale(img, 200);
    })
  )
  .subscribe();

generateButton.onclick = function(e) {
  log('GENERATE BUTTON CLICKED!! Should this do something else?');
};

log('Test application ready');
console.log('Application has loaded');
