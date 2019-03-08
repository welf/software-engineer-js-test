// ancestors and child getters
const getParent = element => element.parentElement;

// disable default dragging behavior
const notDraggable = element => element.setAttribute('draggable', 'false');

// style properties' getters
const getWidth = element => parseFloat(window.getComputedStyle(element).width);

const getHeight = element =>
  parseFloat(window.getComputedStyle(element).height);

const getPadding = element =>
  parseFloat(window.getComputedStyle(element).padding);

const getParentWidth = element => getWidth(getParent(element));

const getParentHight = element => getHeight(getParent(element));

const getDetails = element => {
  const imageStyle = getComputedStyle(element);
  const top = parseFloat(imageStyle.top);
  const left = parseFloat(imageStyle.left);
  const right = parseFloat(imageStyle.right);
  const bottom = parseFloat(imageStyle.bottom);

  const width = parseFloat(imageStyle.width);
  return { top, left, right, bottom, width };
};

module.exports = {
  getParent,
  notDraggable,
  getWidth,
  getHeight,
  getPadding,
  getParentWidth,
  getParentHight,
  getDetails
};
