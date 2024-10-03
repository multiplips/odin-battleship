import Ship from './ship.js';

export default class Gameboard {
  #misses = new Set([]);
  #hits = new Set([]);
  #sunk = new Set([]);
  #allSunk = false;
  #placedShips = [];

  constructor() {
    this.#makeBoard();
    this.#makeFleet();
  }

  get misses() {
    return this.#misses;
  }

  get hits() {
    return this.#hits;
  }

  get sunk() {
    return this.#sunk;
  }

  get allSunk() {
    return this.#allSunk;
  }

  /** Verifies attacked square, then returns attack result (hit/miss). */
  receiveAttack(square) {
    // Attacked square must be a valid square on the board.
    if (!Object.keys(this).includes(square)) {
      return 'invalid';
    }

    // Attacked square must not have been previously attacked.
    if (this.#hits.has(square) || this.#misses.has(square)) {
      return 'duplicate';
    }

    if (this[square].ship) {
      this[square].ship.hit();
      this.#hits.add(square);

      // If ship was sunk, add to set of sunk ships.
      if (this[square].ship.sunk) this.#sunk.add(this[square].ship);

      this.#updateAllSunk();
      return 'hit';
    }

    this.#misses.add(square);
    return 'miss';
  }

  placeShip({ ship, origin, heading }) {
    // NOTE: View sends ship as a string. Need to reassign here so
    // that we can access ship object fields, e.g., length.
    ship = this[ship];

    let shipSquares = this.#calcShipSquares({ ship, origin, heading });
    console.assert(
      shipSquares.length === ship.length,
      'placeShip(): length of coordinate array should match ship length',
    );

    if (shipSquares.length > 0) {
      shipSquares.forEach((square) => (this[square].ship = ship));
      this.#placedShips.push(ship);
      return shipSquares;
    } else {
      return false;
    }
  }

  /**
   * Calculates coordinates of ship's aft and bow squares based upon
   * provided "origin." Returns array of all squares if all are valid,
   * e.g., does not overlap with other ships, returns false otherwise.
   */
  #calcShipSquares({ ship, origin, heading }) {
    let shipLength = ship.length;
    let squares = [];
    let [x, y] = [origin[0], origin.slice(1)];
    console.assert(typeof x === 'string' && typeof y === 'string');

    let bowSquares = Math.floor((shipLength - 1) / 2);
    let aftSquares = shipLength % 2 ? bowSquares : bowSquares + 1;

    // NOTE: A range is used to calculate the ship's placement coordinates.
    // The logic below adjusts for the ship's orientation. E.g., a ship
    // pointing south has its bow to the north (of the board) and vice versa
    // for its bow. Therefore, the bow squares are calculated by subtracting
    // the bow range. Vice versa if the ship was oriented north.
    // This only really matters because the even-lengthed ships have their
    // centers (origin) "between" grid squares, together with planning to
    // visually-support all four cardinal angles for ship orientation.
    let [start, end] = ['s', 'e'].includes(heading)
      ? [aftSquares, bowSquares]
      : [bowSquares, aftSquares];

    for (let i = -start; i <= end; i++) {
      let square;

      if (['n', 's'].includes(heading)) {
        let newY = +y + i;
        if (newY < 1 || newY > 10) return false; // rejects out-of-bounds y
        square = x + String(newY).padStart(2, '0');
      } else {
        let newX = +x.charCodeAt() - 96 + i;
        if (newX < 1 || newX > 10) return false; // rejects out-of-bounds x
        square = String.fromCharCode(newX + 96) + y;
      }

      // rejects occupied squares
      if (this[square].ship !== null) return false;
      squares.push(square);
    }

    return squares;
  }

  #updateAllSunk() {
    if (this.#placedShips.every((ship) => ship.sunk === true)) {
      this.#allSunk = true;
    }
  }

  #makeBoard() {
    let allSquares = {};
    let xAxis = 'abcdefghij'.split('');
    let yAxis = '0123456789'
      .split('')
      .map((y) => String(+y + 1).padStart(2, '0'));

    xAxis.forEach((x) =>
      yAxis.forEach((y) => {
        allSquares[x + y] = {
          value: { ship: null },
          enumerable: true,
        };
      }),
    );

    Object.defineProperties(this, allSquares);
  }

  #makeFleet() {
    let allShips = {};
    let shipTypes = [
      'carrier',
      'battleship',
      'destroyer',
      'submarine',
      'patrol',
    ];

    shipTypes.forEach(
      (type) =>
        (allShips[type] = {
          value: new Ship(type),
          enumerable: false,
        }),
    );

    Object.defineProperties(this, allShips);
  }
}
