const { getParent, getParentWidth, getWidth } = require('./dom-helpers');
const { checkBounds, moveImage } = require('./move-helpers');

// *scaling helper functions*

// calculate new width by scaling
const calculateScaleWidth = (element, percentage) => {
  const currentWidth = getWidth(element);
  const projectedWidth = (currentWidth * percentage) / 100;
  // we don't want to have img width less than allow #imageContainer
  const minimumWidth = getParentWidth(element);
  return projectedWidth < minimumWidth ? minimumWidth : projectedWidth;
};

const updateOffsets = element => {
  const {
    allowedNegativeOffsetX,
    allowedPositiveOffsetX,
    allowedNegativeOffsetY,
    allowedPositiveOffsetY
  } = checkBounds(element);
  if (allowedNegativeOffsetX > 0)
    moveImage(element, -allowedNegativeOffsetX, 0);
  if (allowedPositiveOffsetX < 0)
    moveImage(element, -allowedPositiveOffsetX, 0);
  if (allowedNegativeOffsetY > 0)
    moveImage(element, 0, -allowedNegativeOffsetY);
  if (allowedPositiveOffsetY < 0)
    moveImage(element, 0, -allowedPositiveOffsetY);
};

// canvas width/height ratio should be always equal to 1.5
const updateCanvasWidthHeightRatio = element => {
  const width = getWidth(element);
  const height = width / 1.5;
  element.setAttribute('style', `height:${height}px;`);
  // check if the canvas is fully covered
  updateOffsets(element);
};

// *scaling functions*
// scale img to fit the container width
const scaleToFitParent = element => {
  const width = getParentWidth(element);
  element.style.width = `${width}px`;
  element.style.left = 0 + 'px';
  element.style.right = 0 + 'px';
  updateCanvasWidthHeightRatio(getParent(element));
  updateOffsets(element);
};

// scale img
const scale = (element, percentage) => {
  const newWidth = calculateScaleWidth(element, percentage);
  element.style.width = `${newWidth}px`;
  updateCanvasWidthHeightRatio(getParent(element));
  updateOffsets(element);
};

module.exports = {
  calculateScaleWidth,
  updateCanvasWidthHeightRatio,
  scaleToFitParent,
  scale,
  updateOffsets
};
