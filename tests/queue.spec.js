import { QueueService } from '../src/queue';

describe('Queue test suite', () => {
  it('Should call the functions pushed into the queue.', () => {
    const queue = new QueueService();
    const cb = jest.fn(done => done());
    queue.push(cb);
    queue.push(cb);
    queue.push(cb);
    expect(cb.mock.calls.length).toEqual(3);
  });

  it('Should call the onEntryCb callback when a function is called.', () => {
    const queue = new QueueService();
    const entryCb = jest.fn();
    queue.setOnEntryCb(entryCb);
    const cb = jest.fn(done => done());
    queue.push(cb);
    queue.push(cb);
    queue.push(cb);
    expect(entryCb.mock.calls.length).toEqual(3);
  });

  it('Should call the setOnExitCb callback when a function finishes.', () => {
    const queue = new QueueService();
    const exitCb = jest.fn();
    queue.setOnExitCb(exitCb);
    const cb = jest.fn(done => done());
    queue.push(cb);
    queue.push(cb);
    queue.push(cb);
    expect(exitCb.mock.calls.length).toEqual(3);
  });

  it('Should call the setOnDrainCb when all function finished execution.', () => {
    const queue = new QueueService();
    const drainCb = jest.fn(() => expect(drainCb.mock.calls.length).toEqual(1));
    queue.setOnDrainCb(drainCb);
    const cb = done => setTimeout(done);
    queue.push(cb);
    queue.push(cb);
    queue.push(cb);
  });
});
