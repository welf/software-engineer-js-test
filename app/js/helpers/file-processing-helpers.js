const { notDraggable } = require('./dom-helpers');
const { updateCanvasWidthHeightRatio } = require('./scaling-helpers');

const debugContainer = document.getElementById('debugContainer');

const buttonUp = document.getElementById('button-up');
const buttonLeft = document.getElementById('button-left');
const buttonRight = document.getElementById('button-right');
const buttonDown = document.getElementById('button-down');
const scale50Button = document.getElementById('scale-50');
const scaleToFitButton = document.getElementById('scale-to-fit');
const scale200Button = document.getElementById('scale-200');

// *helper functions*
// show debug/state message on screen
const log = msg => {
  const p = document.createElement('p');
  const text = document.createTextNode(msg);
  p.appendChild(text);
  debugContainer.appendChild(p);
};

// log image dimensions
const logMsgAndReturnImg = event => {
  const img = event.target;
  const msg = `Loaded image w/dimensions ${img.naturalWidth} x ${
    img.naturalHeight
  }`;
  log(msg);
  return img;
};

// is file uploaded and is it an image?
const isImage = file => {
  return !file
    ? false
    : file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif'
    ? true
    : false;
};

// check whether uploaded file is an image, and if yes read it
const processFile = file => {
  if (!file) return;
  if (!isImage(file)) {
    log('Not a valid image file: ' + file.name);
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return reader;
};

// create an <img> DOM element
const createImg = readerResult => {
  const img = document.createElement('img');
  img.src = readerResult;
  img.id = 'pic';
  return img;
};

// get <img>
const getImageById = () => document.getElementById('pic');

// clear #imageContainer before adding an <img> DOM element
const clearContainer = container => {
  while (container.childNodes.length > 0)
    container.removeChild(container.childNodes[0]);
};

// activate buttons
const activateButtons = () => {
  buttonUp.disabled = false;
  buttonLeft.disabled = false;
  buttonRight.disabled = false;
  buttonDown.disabled = false;
  scale50Button.disabled = false;
  scaleToFitButton.disabled = false;
  scale200Button.disabled = false;
};

// append <img> to #imageContainer and return a reference to it
const renderImage = (img, container) => {
  clearContainer(container);
  const picture = container.appendChild(img);
  // disable default dragging behavior og the <img> DOM element
  notDraggable(picture);
  updateCanvasWidthHeightRatio(container);
  activateButtons();
  return picture;
};

module.exports = {
  log,
  logMsgAndReturnImg,
  processFile,
  createImg,
  getImageById,
  clearContainer,
  renderImage
};
