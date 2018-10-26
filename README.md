# Utils.js

Across your work, you will most likely encounter different problems which are solved by copying code from a project to another. I've been there, done that.

Therefore, I have made this library which exposes my most used classes and methods for accessibility sake.

Feel free to contribute if you feel like.

Credits:
See the video of how this was made [here](http://dev.topheman.com/package-a-module-for-npm-in-commonjs-es2015-umd-with-babel-and-rollup/)

## Quickstart

``` sh
# Clone the repo
git clone git@github.com:NoMercy235/utils.git

# Move into the repo
cd  utils/

# Install dependencies
npm install

# Run tests
npm test
```

## Usage

This library works with both Harmony and CommonJS modules.

### Utils library

- `safeAccess(obj: Object, path: string, ...args)`

Safely access a property located at any depth of an object. Returns undefined if the path does not exist.

It's just a middleware for the [safe-access](https://www.npmjs.com/package/safe-access) library.

```
import { Utils } from '@nomercy235/utils';

const myObj = { path: { to: { deep: { property: 'myValue' } } } };

// Usually you'd try to reach the `property` property like this:
// if (myObj.path && myObj.path.to && myObj.path.to.deep && myObj.path.to.deep.property) {
//    ... code
// }

// Now you can do it like this:
if (Utils.safeAccess(myObj, 'path.to.deep.property')) {
  // code
}

// It also works with functions
const myFoo = { path: { to: { foo: () => { console.log('Hello world!'); } } } };
Utils.safeAccess(myFoo, 'path.to.foo()');
// => Hello world!

// You can also pass arguments
const myFoo = { path: { to: { foo: (name) => { console.log(`Hello ${name}!`); } } } };
Utils.safeAccess(myFoo, 'path.to.foo()', 'world');
// => Hello world!
```

- `flattenArray(arr: any[])``

Turns an array of any dimension into a one-dimensional array.

```
import { Utils } from '@nomercy235/utils';

Utils.flattenArray([1, [2, 3], [4, [5, [6]]]])
// => [1, 2, 3, 4, 5, 6]
```

- `getClassesFromObject(obj: Object)`

Convert an object into a string, where each object's property is a class name.

```
import { Utils } from '@nomercy235/utils';

Utils.getClassesFromObject({ 'dot': false, 'btn': true, 'btn-default': true })
// => 'btn btn-default'
```

- `generateId(str: string, tailDigits: number)`

Generate a unique id based on a given string and with some digits at the end.

```
import { Utils } from '@nomercy235/utils';

Utils.generateId('myId')
// => myId-4325
```

- `flattenObject(obj: Object)`

Make every nested properties of an object a property of depth 1.

```
import { Utils } from '@nomercy235/utils';

const myObj = { a: { prop1: 'depth2' }, b: { prop2: 'depth2' } }
Utils.flattenObject(myObj)
// => { prop1: 'depth2', prop2: 'depth2' }
```

- `deepCopy(obj: Object)`

Deep copy of the given object to ensure that no reference is held back to.

Courtesy to the [clone](https://www.npmjs.com/package/clone)

```
import { Utils } from '@nomercy235/utils';

const myObj = { nested: { arr: [1, 2, 3] } }
const newObj = Utils.deepCopy(myObj)
myObj.nested === newObj.nested
// => false

// As opposed to
const myObj = { nested: { arr: [1, 2, 3] } }
const newObj = Object.assign({}, myObj)
myoBJ.nested === newObj.nested
// => true
```
