# Utils.js

Across your work, you will most likely encounter different problems which are solved by copying code from a project to another. I've been there, done that.

Therefore, I have made this library which exposes my most used classes and methods for accessibility sake.

Feel free to contribute if you feel like.

Credits:
See the video of how this was made [here](http://dev.topheman.com/package-a-module-for-npm-in-commonjs-es2015-umd-with-babel-and-rollup/)

## Install

```sh
npm install @nomercy235/utils
```

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

```javascript
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

```javascript
import { Utils } from '@nomercy235/utils';

Utils.flattenArray([1, [2, 3], [4, [5, [6]]]])
// => [1, 2, 3, 4, 5, 6]
```

- `getClassesFromObject(obj: Object)`

Convert an object into a string, where each object's property is a class name.

```javascript
import { Utils } from '@nomercy235/utils';

Utils.getClassesFromObject({ 'dot': false, 'btn': true, 'btn-default': true })
// => 'btn btn-default'
```

- `generateId(str: string, tailDigits: number)`

Generate a unique id based on a given string and with some digits at the end.

```javascript
import { Utils } from '@nomercy235/utils';

Utils.generateId('myId')
// => myId-4325
```

- `flattenObject(obj: Object)`

Make every nested properties of an object a property of depth 1.

```javascript
import { Utils } from '@nomercy235/utils';

const myObj = { a: { prop1: 'depth2' }, b: { prop2: 'depth2' } }
Utils.flattenObject(myObj)
// => { prop1: 'depth2', prop2: 'depth2' }
```

- `deepCopy(obj: Object)`

Deep copy of the given object to ensure that no reference is held back to.

Courtesy to the [clone](https://www.npmjs.com/package/clone)

```javascript
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

### Queue library

Instantiate an object specifying the maximum number of concurrency functions.

```javascript
import { Queue } from '@nomercy235/utils';

const queueService = new QueueService(5);
```

- `push(cb: Function)`

Push a function into the queue. It will be executed as soon as the concurrency filter allows it.

- `setOnEntryCb(cb: Function)`

Callback to be called whenever a function inside the queue starts executing

- `setOnExitCb(cb: Function)`

Callback to be called whenever a function which is executing finishes execution

- `setOnDrainCb(cb: Function)`

Callback to be called when the queue finishes all the functions.

### EventsService library

A singleton service which handles the communication of different parts of your code through events.
```javascript
import { EventsService } from '@nomercy235/utils';
```

- `notifyDataChanged(event: string | string[], value?: any, context?: any)`

This method notifies all subscribers that an event has occurred.

```javascript
payload = { prop: 'data' };
eventsService.notifyDataChanged('my_event', payload);
```

- `subscribe(event: string, callback: Function, options: EventsServiceOptions): Subscription`

```javascript
interface EventsServiceOptions {
  subscriptions: Subscription[];
  withLastValue: boolean;
}
```

This method subscribes to an event so that the caller can react when a change happens on that specific event.

If you want to have your callback called immediately with the lastValue that was sent on the event stream, you can specify it with the `withLastValue` property.

```javascript
// at some point
eventsService.notifyDataChanged('my_event', 'immediately');

// later in your app
eventsService.subscribe(
  'my_event',
  val => console.log('called ' + val),
  { withLastValue: true }
);
```

You will need to unsubscribe the resulted subscription when you no longer need it. If you want to do that, there are two options:
  1. Either save the Subscription returned by the `subscribe` method and call the `unsubscribe` method with an array containing the Subscription:

```javascript
const sub = eventService.subscribe(...);
eventsService.unsubscribe([sub])
```

  2. Pass an object to the `subscriptions` property of the `options` argument

```javascript
const subs = {};
eventsService.subscribe(..., { subscriptions: subs });
eventsService.subscribe(..., { subscriptions: subs });
eventsService.unsubscribe(subs);
```

- `unsubscribe(subs: Subscription[] | { [event_name]: Subscription: [] })`

Unsubscribes all subscriptions from an event to avoid memory leak.

- `getCurrentValue(event: string, defaultValue: any = null)`

Get the current value stored in an event stream or a default one if the event stream doesn't have any.

- `setCurrentValue(event: string, value: any, context: any = null)`

Set the value for an event stream.
