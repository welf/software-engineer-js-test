const { getParent, getDetails } = require('./dom-helpers');

// *move image helper function*

// check img bounds
const checkBounds = element => {
  const imageBounds = element.getBoundingClientRect();
  const elemLeft = parseFloat(imageBounds.left);
  const elemRight = parseFloat(imageBounds.right);
  const elemTop = parseFloat(imageBounds.top);
  const elemBottom = parseFloat(imageBounds.bottom);

  const parentBounds = getParent(element).getBoundingClientRect();
  const parentLeft = parseFloat(parentBounds.left);
  const parentRight = parseFloat(parentBounds.right);
  const parentTop = parseFloat(parentBounds.top);
  const parentBottom = parseFloat(parentBounds.bottom);

  const allowedNegativeOffsetX = parentRight - elemRight;

  const allowedPositiveOffsetX = parentLeft - elemLeft;

  const allowedNegativeOffsetY = parentBottom - elemBottom;

  const allowedPositiveOffsetY = parentTop - elemTop;

  return {
    allowedNegativeOffsetX,
    allowedPositiveOffsetX,
    allowedNegativeOffsetY,
    allowedPositiveOffsetY
  };
};

// move image by dragging it (to variable distance)
const moveImage = (element, offsetX, offsetY) => {
  const { top, left, right, bottom } = getDetails(element);
  const {
    allowedNegativeOffsetX,
    allowedPositiveOffsetX,
    allowedNegativeOffsetY,
    allowedPositiveOffsetY
  } = checkBounds(element);

  if (offsetX < allowedNegativeOffsetX) {
    element.style.left = left + allowedNegativeOffsetX + 'px';
  }

  if (offsetX > allowedPositiveOffsetX) {
    element.style.left = left + allowedPositiveOffsetX + 'px';
  }

  if (offsetX >= allowedNegativeOffsetX && offsetX <= allowedPositiveOffsetX) {
    element.style.left = left + offsetX + 'px';
  }

  if (offsetY < allowedNegativeOffsetY) {
    element.style.top = top + allowedNegativeOffsetY + 'px';
  }

  if (offsetY > allowedPositiveOffsetY) {
    element.style.top = top + allowedPositiveOffsetY + 'px';
  }

  if (offsetY >= allowedNegativeOffsetY && offsetY <= allowedPositiveOffsetY) {
    element.style.top = top + offsetY + 'px';
  }
};

module.exports = {
  moveImage,
  checkBounds
};
