/**
 * Градусов в радиане
 * @type {number}
 * @const
 */
var DEGREES_IN_RADIAN = 180 / Math.PI;

/**
 * Посчитать угол линии между двумя точками
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
module.exports = function calcAngle( x1, y1, x2, y2)
{
	return Math.atan2( ( y2 - y1 ), ( x2 - x1 ) ) * DEGREES_IN_RADIAN;
}
