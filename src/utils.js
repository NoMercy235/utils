const access = require('safe-access');
const clone = require('clone');

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

/**
 * @desc Generate a unique id based on a given string and with some digits at the end.
 * @param {string} str
 * @param {number} tailDigits
 * @returns {string}
 */
export function generateId(str, tailDigits = 4) {
  let buffer = str.replace(/ /g, '-')
    .replace(/\(|\)|'|"|\/|\\|<|>/g, '')
    .toLowerCase();
  let tail = '';
  if (tailDigits) tail = '-' + (Math.random() + '').substr(-tailDigits);
  return buffer + tail;
}

/**
 * @desc Make every nested properties of an object a property of depth 1.
 * @param {Object} obj
 * @param {boolean} keepParent
 */
export function flattenObject(obj, keepParent = false) {
  let result = {};
  (function recurse (curr, prop = '') {
    if (Object(curr) !== curr) {
      result[prop] = curr;
    } else if (Array.isArray(curr)) {
      if (!curr.length) {
        result[prop] = [];
      } else {
        for (let i = 0, l = curr.length; i < l; i++) {
          recurse(curr[i], prop + '[' + i + ']');
        }
      }
    } else {
      let isEmpty;
      for (let p of Object.keys(curr)) {
        isEmpty = false;
        recurse(curr[p], (keepParent ? (prop ? prop + '.' : '') : '') + p);
      }
      if (isEmpty && prop) { result[prop] = {}; }
    }
  }(obj));
  return result;
}

/**
 * @desc Deep copy of the given object to ensure that no reference is held back to
 * the previous object.
 * @param {Object} obj
 * @returns {*}
 */
export function deepCopy(obj) {
  return clone(obj);
}
