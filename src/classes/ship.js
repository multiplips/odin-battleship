export default class Ship {
  #shipLengths = {
    carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    patrol: 2,
  };
  #sunk = false;
  #hits = 0;

  constructor(shipType) {
    if (!Object.keys(this.#shipLengths).includes(shipType)) {
      throw new Error('Invalid ship type.');
    }

    Object.defineProperty(this, 'type', {
      value: shipType,
      enumerable: true,
    });

    Object.defineProperty(this, 'length', {
      value: this.#shipLengths[shipType],
      enumerable: true,
    });
  }

  get sunk() {
    return this.#sunk;
  }

  get hits() {
    return this.#hits;
  }

  hit() {
    if (this.#hits < this.length) {
      ++this.#hits;
      this.#sunk = this.#hits === this.length ? true : false;
    }
    return this;
  }
}
