import { EventsService } from '../src/events';

describe('EventsService test suite', () => {
  let eventsService;

  beforeEach(() => {
    eventsService = new EventsService();
  });

  it('Should fire an event.', done => {
    const subscription = eventsService.subscribe('test_event', () => {
      expect(true).toBeTruthy();
      eventsService.unsubscribe([subscription]);
      done();
    });
    eventsService.notifyDataChanged('test_event');
  });

  it('Should fire an event with a specific data.', done => {
    const subscription = eventsService.subscribe('test_event', data => {
      expect(data).toEqual({ context: null, value: 'Test data' });
      eventsService.unsubscribe([subscription]);
      done();
    });
    eventsService.notifyDataChanged('test_event', 'Test data');
  });

  it('Should not fire an event if the context is not right.', done => {
    let subs = {};
    eventsService.subscribe('test_event', data => {
      if (data.context !== 'context_1') return;
      expect(true).toEqual(false);
      done();
    }, { subscriptions: subs });
    eventsService.subscribe('test_event', data => {
      if (data.context !== 'context_2') return;
      expect(true).toBeTruthy();
      done();
    }, { subscriptions: subs });
    eventsService.notifyDataChanged('test_event', 'Test data', 'context_2');
  });

  it('Should not be called if no subscription is notified.', () => {
    const subscription = eventsService.subscribe('test_event', () => {
      expect(true).toEqual(false);
    });
    eventsService.unsubscribe([subscription]);
    expect(true).toBeTruthy();
  });

  it('Should be called with last value.', done => {
    eventsService.notifyDataChanged('test_event', 'Test data');
    const subscription = eventsService.subscribe('test_event', data => {
      expect(data).toEqual({ context: null, value: 'Test data' });
      done();
    }, { withLastValue: true });
    eventsService.unsubscribe([subscription]);
  });

  it('Should get the last value.', () => {
    eventsService.notifyDataChanged('test_event', 'Test data');
    const data = eventsService.getCurrentValue('test_event');
    expect(data).toEqual({ context: null, value: 'Test data' });
  });

  it('Should set the last value.', () => {
    eventsService.setCurrentValue('test_event', 'Test data');
    const data = eventsService.getCurrentValue('test_event');
    console.log(data);
    expect(data).toEqual({ context: null, value: 'Test data' });
  });

  it('Should set the last value as array.', () => {
    eventsService.setCurrentValue(['test_event_1', 'test_event_2'], 'Test data');
    const data1 = eventsService.getCurrentValue('test_event_1');
    const data2 = eventsService.getCurrentValue('test_event_2');
    expect(data1).toEqual({ context: null, value: 'Test data' });
    expect(data2).toEqual({ context: null, value: 'Test data' });
  });

  it('Should not call an unsubscribed subscription.', () => {
    const subscription = eventsService.subscribe('test_event', () => {
      expect(true).toEqual(false);
    });
    eventsService.unsubscribe([subscription]);
    eventsService.notifyDataChanged('test_event', 'Test data');
    expect(true).toBeTruthy();
  });

  it('Should attach the new subscription to the subscriptions object.', () => {
    let subs = {};
    eventsService.subscribe('test_event', () => {}, { subscriptions: subs });
    eventsService.subscribe('test_event', () => {}, { subscriptions: subs });
    eventsService.subscribe('test_event', () => {}, { subscriptions: subs });
    eventsService.subscribe('another_test', () => {}, { subscriptions: subs });
    eventsService.subscribe('another_test', () => {}, { subscriptions: subs });
    expect(Object.keys(subs).length).toEqual(2);
    expect(Object.keys(subs['test_event']).length).toEqual(3);
    expect(Object.keys(subs['another_test']).length).toEqual(2);
    eventsService.unsubscribe(subs);
  });

  it('Should notify the same value to an array of events.', () => {
    let subs = {};
    const myObj = { foo: (val) => val };
    const spy = jest.spyOn(myObj, 'foo');
    eventsService.subscribe('test_event', myObj.foo, { subscriptions: subs });
    eventsService.subscribe('another_test', myObj.foo, { subscriptions: subs });
    eventsService.notifyDataChanged(['test_event', 'another_test'], 'Test data');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({ context: null, value: 'Test data' });
    eventsService.unsubscribe(subs);
  });
});
