import Ship from './ship.js';

export default class Gameboard {
  #board = {};
  #misses = new Set([]);
  #hits = new Set([]);
  #sunk = new Set([]);
  #allSunk = false;

  carrier;
  battleship;
  destroyer;
  submarine;
  patrol;

  constructor() {
    this.#makeBoard();
    this.#makeFleet();
  }

  get board() {
    return this.#board;
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

  receiveAttack(coordinates) {
    if (this.#board[coordinates].ship) {
      this.#board[coordinates].ship.hit();
      this.#hits.add(coordinates);
      this.#updateSunkState();
      return true;
    } else {
      this.#misses.add(coordinates);
      return false;
    }
  }

  placeShip(position) {
    let { ship } = position;
    let squares = this.#calcShipSquares(position);

    console.assert(
      squares.length === ship.length,
      'placeShip(): squares length should match ship length',
    );

    if (squares) {
      for (let square of squares) {
        this.#board[square].ship = ship;
      }
      return true;
    }

    return false;
  }

  /**
   * Calculates coordinates of ship's aft and bow squares based upon
   * provided "origin." Returns array of all squares if all are valid,
   * e.g., does not overlap with other ships, returns false otherwise.
   */
  #calcShipSquares({ ship, origin, heading }) {
    let shipLength = ship.length;
    let squares = [];
    let [x, y] = [origin[0], +origin.slice(1)];

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
        let newY = y + i;
        if (newY < 1 || newY > 10) return false; // INFO: rejects out-of-bounds y
        square = x + newY;
      } else {
        let newX = +x.charCodeAt() - 96 + i;
        if (newX < 1 || newX > 10) return false; // INFO: rejects out-of-bounds x
        square = String.fromCharCode(newX + 96) + y;
      }
      // INFO: rejects occupied squares
      if (this.#board[square].ship !== null) return false;
      squares.push(square);
    }

    return squares;
  }

  #updateSunkState() {
    let fleet = [
      this.carrier,
      this.battleship,
      this.destroyer,
      this.submarine,
      this.patrol,
    ];

    if (fleet.every((ship) => ship.sunk === true)) {
      this.#allSunk = true;
    }
  }

  #makeBoard() {
    let xAxis = 'abcdefghij'.split('');
    let yAxis = '0123456789'.split('').map((x) => +x + 1 + '');

    for (let y of yAxis) {
      for (let x of xAxis) {
        this.#board[x + y] = { ship: null };
      }
    }
  }

  #makeFleet() {
    ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol'].forEach(
      (ship) => (this[ship] = new Ship(ship)),
    );
  }
}
