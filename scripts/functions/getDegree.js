const DEGREES_IN_RADIAN = 180 / Math.PI;

module.exports = function getDegree(x1, y1, x2, y2) {
  return Math.atan2((y2 - y1), (x2 - x1)) * DEGREES_IN_RADIAN;
};
