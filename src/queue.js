const Queue = require('async-function-queue');

export class QueueService {
  constructor(concurrency = 3) {
    this.queue = new Queue(concurrency);
  }

  push(cb) {
    this.queue.push(cb);
  }

  setOnEntryCb(cb) {
    this.queue.on('entry', cb);
  }

  setOnExitCb(cb) {
    this.queue.on('exit', cb);
  }

  setOnDrainCb(cb) {
    this.queue.on('drain', cb);
  }
}
