export default class EventBus extends EventTarget {
  constructor() {
    super();
  }

  publish(eventObject) {
    console.debug(`emitting: ${eventObject.type}`);
    return this.dispatchEvent(eventObject);
  }

  subscribe(eventType, callback) {
    return this.addEventListener(eventType, callback);
  }
}
