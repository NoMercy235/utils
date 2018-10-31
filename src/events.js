import { Subject } from 'rxjs';

/**
 * @desc This class makes use of the observable pattern implemented by the rxjs
 * library to allow components to immediately react when a specific event occurs
 * somewhere in the application. It should not be used as a replacement for
 * redux, but as a means of communication between components.
 *
 * Please note that this class follows the singleton pattern.
 */
export class EventsService {
  constructor() {
    if (!EventsService._instance) {
      EventsService._instance = this;
    } else {
      return EventsService._instance;
    }
    this.stream = {};
    this.lastValues = {};
    return this;
  }

  /**
   * @desc This method notifies all subscribers that an event has occurred.
   * @param {string | string[]} event: The name of the event.
   * @param {*} value: The value that will be advertised to the subscribers.
   * @param {*} context: A way to filter down the subscribers which will respond
   * to an event (e.g. multiple subscribers listen to the same event, and you
   * need to notify only one of them that something happened, or you need the
   * same subscriber to act differently based on some context).
   */
  notifyDataChanged(event, value = null, context = null) {
    if (Array.isArray(event)) {
      event.forEach(e => this.notifyDataChanged(e, value, context));
      return;
    }
    this.lastValues[event] = value;
    // If none subscribed yet to the event, don't call next().
    if (!this.stream[event]) return;
    const payload = { value, context };
    this.stream[event].next(payload);
  }

  /**
   * @desc This method subscribes to an event so that the caller can react when
   * a change happens on that specific event.
   * @param {string} event: The name of the event.
   * @param {Function} callback: It will be called whenever a change occurs for
   * the registered event.
   * @param {{ withLastValue: boolean, subscriptions: {[event]: *[]} }} options:
   * - withLastValue: Pass true if you want to have your callback
   * - subscriptions: WARNING! This object will be mutated by the method. It will
   * be filled with the subscriptions created which will allow the caller to unsubscribe
   * at a later time.
   */
  subscribe(event, callback, options = {}) {
    if (!this.stream[event]) this.stream[event] = new Subject();
    if (options.withLastValue && this.lastValues[event])
      callback(this.lastValues[event]);
    const subscription = this.stream[event].subscribe(callback);

    const subscriptions = options.subscriptions;

    if (subscriptions) {
      if (!subscriptions[event]) subscriptions[event] = [];
      subscriptions[event].push(subscription);
    }

    return subscription;
  }

  /**
   * @desc Method which unsubscribes all subscriptions from an event to avoid
   * memory leak.
   * @param {{[string]: *[]} | *[]} subscriptions: The array which holds the subscriptions.
   */
  unsubscribe(subscriptions) {
    if (Array.isArray(subscriptions)) {
      subscriptions.forEach(sub => sub.unsubscribe());
    } else {
      Object.keys(subscriptions).forEach(event => {
        subscriptions[event].forEach(sub => {
          sub.unsubscribe();
        });
      });
    }
  }

  /**
   * @desc Get the current value stored in an event stream or a default one
   * if the event stream doesn't have any.
   * @param {string} event: The name of the event.
   * @param {*} defaultValue: The default value.
   * @returns {*}
   */
  getCurrentValue(event, defaultValue = null) {
    return this.lastValues[event] || defaultValue;
  }

  /**
   * @desc Set the value for an event stream.
   * @param {string | string[]} event: The name of the event.
   * @param {*} value: The value to be stored.
   */
  setCurrentValue(event, value) {
    if (Array.isArray(event)) {
      event.forEach(e => this.setCurrentValue(e, value));
      return;
    }
    this.lastValues[event] = value;
  }
}
