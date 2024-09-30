import Gameboard from '../classes/gameboard.js';

// init new gameboard for each test
let board;
let validCarrier, validBattleship, validDestroyer, validSubmarine, validPatrol;
beforeEach(() => {
  board = new Gameboard();
  validCarrier = { ship: board.carrier, origin: 'b4', heading: 'n' };
  validBattleship = { ship: board.battleship, origin: 'g7', heading: 'n' };
  validDestroyer = { ship: board.destroyer, origin: 'h3', heading: 's' };
  validSubmarine = { ship: board.submarine, origin: 'e7', heading: 'w' };
  validPatrol = { ship: board.patrol, origin: 'c9', heading: 'e' };
});

describe('board init', () => {
  test('board should initialize all squares', () => {
    expect(board.board.a1).toEqual({ ship: null });
    expect(board.board.e5).toEqual({ ship: null });
    expect(board.board.j10).toEqual({ ship: null });
    expect(Object.keys(board.board).length).toBe(100);
  });
});

describe('ship placement', () => {
  test('placeShip verifies placement with true', () => {
    expect(board.placeShip(validCarrier)).toBe(true);
  });

  test('ship occupies squares after placement #1', () => {
    // NOTE: verifying creation of correct ship by checking ship length
    // e.g., carrier should have length 5.
    board.placeShip(validCarrier);
    ['b2', 'b3', 'b4', 'b5', 'b6'].forEach((square) =>
      expect(board.board[square].ship.length).toEqual(board.carrier.length),
    );
  });

  test('ship occupies squares after placement #2', () => {
    board.placeShip(validSubmarine);
    ['d7', 'e7', 'f7'].forEach((square) =>
      expect(board.board[square].ship.length).toEqual(board.submarine.length),
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
      expect(board.placeShip(position)).toBe(true);
    });
  });

  test('prevent overlapping ships ', () => {
    let overlap = { ship: board.submarine, origin: 'c5', heading: 'e' };
    board.placeShip(validCarrier);
    expect(board.placeShip(overlap)).toBe(false);
  });

  test('prevent out-of-bounds placement', () => {
    let oobLeft = { ship: board.carrier, origin: 'a7', heading: 'w' };
    let oobRight = { ship: board.battleship, origin: 'j6', heading: 'e' };
    let oobTop = { ship: board.submarine, origin: 'f1', heading: 'n' };
    let oobBottom = {
      ship: board.destroyer,
      origin: 'g10',
      heading: 's',
    };
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
    let successfulHit = 'b2';
    expect(board.receiveAttack(successfulHit)).toBe(true);
    expect(board.board[successfulHit].ship.hits).toBe(1);
  });

  test('do nothing on unsuccessful attack', () => {
    let failedHit = 'c2';
    expect(board.receiveAttack(failedHit)).toBe(false);
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
    let missedShots = new Set(['d2', 'd4', 'f5', 'f7']);
    missedShots.forEach((miss) => board.receiveAttack(miss));
    expect(board.misses).toEqual(missedShots);
  });

  test('track all successful shots', () => {
    let successfulShots = new Set(['b2', 'b3', 'b4', 'b5', 'b6']);
    successfulShots.forEach((hit) => board.receiveAttack(hit));
    expect(board.hits).toEqual(successfulShots);
  });

  test('track all sunk ships', () => {
    // place remaining ships
    [validDestroyer, validSubmarine, validBattleship, validPatrol].forEach(
      (ship) => board.placeShip(ship),
    );

    let order66 = [
      'b2',
      'b3',
      'b4',
      'b5',
      'b6',
      'b9',
      'c9',
      'h2',
      'h3',
      'h4',
      'd7',
      'e7',
      'f7',
      'g6',
      'g7',
      'g8',
      'g9',
    ];
    order66.forEach((strike) => board.receiveAttack(strike));
    expect(board.allSunk).toBe(true);
  });
});
