export default class Boat {
  #shipLengths = {
    carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    patrol: 2,
  };
  #sunk = false;
  #hits = 0;
  #length = 0;

  constructor(shipType) {
    this.#length = this.#shipLengths[shipType];
  }

  get sunk() {
    return this.#sunk;
  }

  get hits() {
    return this.#hits;
  }

  get length() {
    return this.#length;
  }

  hit() {
    if (this.#hits < this.#length) {
      ++this.#hits;
      this.#isSunk();
    }
    return this;
  }

  #isSunk() {
    this.#sunk = this.#hits >= this.#length ? true : false;
  }
}
