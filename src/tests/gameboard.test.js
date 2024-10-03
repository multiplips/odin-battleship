import Gameboard from '../classes/gameboard.js';

// init new gameboard for each test
let board;
let validCarrier, validBattleship, validDestroyer, validSubmarine, validPatrol;
beforeEach(() => {
  board = new Gameboard();
  validCarrier = { ship: 'carrier', origin: 'b04', heading: 'n' };
  validBattleship = { ship: 'battleship', origin: 'g07', heading: 'n' };
  validDestroyer = { ship: 'destroyer', origin: 'h03', heading: 's' };
  validSubmarine = { ship: 'submarine', origin: 'e07', heading: 'w' };
  validPatrol = { ship: 'patrol', origin: 'c09', heading: 'e' };
});

describe('board init', () => {
  test('board should initialize all squares', () => {
    expect(board.a01).toEqual({ ship: null });
    expect(board.e05).toEqual({ ship: null });
    expect(board.j10).toEqual({ ship: null });
    expect(Object.keys(board).length).toBe(100);
  });
});

describe('ship placement', () => {
  test('placeShip verifies placement with array of coordinates', () => {
    let placeShipReturn = board.placeShip(validCarrier);
    let shipLength = board[validCarrier.ship].length;
    expect(Array.isArray(placeShipReturn)).toBe(true);
    expect(placeShipReturn).toHaveLength(shipLength);
  });

  test('ship occupies squares after placement #1', () => {
    // NOTE: verifying creation of correct ship by checking ship length
    // e.g., carrier should have length 5.
    board.placeShip(validCarrier);
    ['b02', 'b03', 'b04', 'b05', 'b06'].forEach((square) =>
      expect(board[square].ship).toHaveLength(board.carrier.length),
    );
  });

  test('ship occupies squares after placement #2', () => {
    board.placeShip(validSubmarine);
    ['d07', 'e07', 'f07'].forEach((square) =>
      expect(board[square].ship).toHaveLength(board.submarine.length),
    );
  });

  test('board allows placement on all angles', () => {
    [
      validCarrier,
      validBattleship,
      validDestroyer,
      validSubmarine,
      validPatrol,
    ].forEach((position) => {
      let placeShipReturn = board.placeShip(position);
      let shipLength = board[position.ship].length;
      expect(Array.isArray(placeShipReturn)).toBe(true);
      expect(placeShipReturn).toHaveLength(shipLength);
    });
  });

  test('prevent overlapping ships ', () => {
    let overlap = { ship: 'submarine', origin: 'c05', heading: 'e' };
    board.placeShip(validCarrier);
    expect(board.placeShip(overlap)).toBe(false);
  });

  test('prevent out-of-bounds placement', () => {
    let oobLeft = { ship: 'carrier', origin: 'a07', heading: 'w' };
    let oobRight = { ship: 'battleship', origin: 'j06', heading: 'e' };
    let oobTop = { ship: 'submarine', origin: 'f01', heading: 'n' };
    let oobBottom = { ship: 'destroyer', origin: 'g10', heading: 's' };
    [oobLeft, oobRight, oobTop, oobBottom].forEach((position) => {
      expect(board.placeShip(position)).toBe(false);
    });
  });
});

describe('receiveAttack tests', () => {
  beforeEach(() => {
    board.placeShip(validCarrier);
  });

  test('call hit() on successful attack, ship registers damage', () => {
    let successfulHit = 'b02';
    expect(board.receiveAttack(successfulHit)).toBe('hit');
    expect(board[successfulHit].ship.hits).toBe(1);
  });

  test(`missing a shot returns 'miss'`, () => {
    let failedHit = 'c02';
    expect(board.receiveAttack(failedHit)).toBe('miss');
  });
});

describe('shot tracking', () => {
  beforeEach(() => {
    board.placeShip(validCarrier);
  });

  test('all tracking variables start empty/false', () => {
    expect(board.misses).toEqual(new Set([]));
    expect(board.hits).toEqual(new Set([]));
    expect(board.sunk).toEqual(new Set([]));
    expect(board.allSunk).toBe(false);
  });

  test('track all missed shots', () => {
    let missedShots = new Set(['d02', 'd04', 'f05', 'f07']);
    missedShots.forEach((miss) => board.receiveAttack(miss));
    expect(board.misses).toEqual(missedShots);
  });

  test('track all successful shots', () => {
    let successfulShots = new Set(['b02', 'b03', 'b04', 'b05', 'b06']);
    successfulShots.forEach((hit) => board.receiveAttack(hit));
    expect(board.hits).toEqual(successfulShots);
  });

  test('track all sunk ships', () => {
    // place remaining ships
    [validDestroyer, validSubmarine, validBattleship, validPatrol].forEach(
      (ship) => board.placeShip(ship),
    );

    let order66 = [
      'b02',
      'b03',
      'b04',
      'b05',
      'b06',
      'b09',
      'c09',
      'h02',
      'h03',
      'h04',
      'd07',
      'e07',
      'f07',
      'g06',
      'g07',
      'g08',
      'g09',
    ];
    order66.forEach((strike) => board.receiveAttack(strike));
    expect(board.allSunk).toBe(true);
  });
});
