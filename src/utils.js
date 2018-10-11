const access = require('safe-access');

/**
 * @desc Helper method to access the property of an object in a safe manner.
 * @param {Object} obj: The object you want to access.
 * @param {string} path: Written in dot notation.
 * @param {any[]} args: In case you want to call a function, you can also send
 * arguments to it.
 * @returns {any}
 *
 * Usage examples:
 * safeAccess(obj, 'path.to.property')
 * safeAccess(obj, 'path.to.method()', [arg1, arg2])
 */
export function safeAccess(obj, path, ...args) {
  return access(obj, path, args);
}

/**
 * @desc Turn any array into one dimension.
 * @param {any[]} arr: The array to be flattened.
 * @returns {any[]}: the flattened array.
 *
 * Usage example:
 * flattenArray([1, [2, 3], [4, [5, [6]]]])
 * => [1, 2, 3, 4, 5, 6]
 */
export function flattenArray(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
  }, []);
}

/**
 * @desc Convert an object into a string, where each object's property is a
 * class name
 * @param {*} obj
 * @returns {string}
 *
 * Usage examples:
 * getClassesFromObject({ 'il-dot': false, 'btn': true, 'btn-default': true }
 * => 'btn btn-default'
 */
export function getClassesFromObject(obj) {
  return Object.keys(obj).filter(key => obj[key]).join(' ');
}
