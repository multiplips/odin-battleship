import Gameboard from '../classes/gameboard.js';
import Ship from '../classes/ship.js';

// init new gameboard for each test
let board;
beforeEach(() => {
  board = new Gameboard();
});

let carrier = new Ship('carrier');
let battleship = new Ship('battleship');
let destroyer = new Ship('destroyer');
let submarine = new Ship('submarine');
let patrol = new Ship('patrol');

let validCarrier = { ship: carrier, origin: 'b4', heading: 'n' };
let validBattleship = { ship: battleship, origin: 'g7', heading: 'n' };
let validDestroyer = { ship: destroyer, origin: 'h3', heading: 's' };
let validSubmarine = { ship: submarine, origin: 'e7', heading: 'w' };
let validPatrol = { ship: patrol, origin: 'c9', heading: 'e' };

describe('ship placement', () => {
  test('placeShip calls ship instances to place ships', () => {
    expect(board.placeShip(validCarrier).toBe(true));
  });

  test('board allows placement on all angles', () => {
    [
      validCarrier,
      validBattleship,
      validDestroyer,
      validSubmarine,
      validPatrol,
    ].forEach((position) => {
      expect(board.placeShip(position).toBe(true));
    });
  });

  test('prevent overlapping ships ', () => {
    let overlap = { ship: submarine, origin: 'c5', heading: 'e' };
    board.placeShip(validCarrier);
    expect(board.placeShip(overlap).toBe(false));
  });

  test('prevent out-of-bounds placement', () => {
    let oobLeft = { ship: carrier, origin: 'a7', heading: 'w' };
    let oobRight = { ship: battleship, origin: 'j6', heading: 'e' };
    let oobTop = { ship: submarine, origin: 'f1', heading: 'n' };
    let oobBottom = { ship: destroyer, origin: 'g10', heading: 's' };

    [oobLeft, oobRight, oobTop, oobBottom].forEach((position) => {
      expect(board.placeShip(position).toBe(false));
    });
  });

  test('record cells occupied by ships', () => {
    expect(board.occupied).toEqual([]);

    board.placeShip(validCarrier);
    ['b2', 'b3', 'b4', 'b5', 'b6'].forEach((cell) =>
      expect(board.occupied).toContain(cell),
    );

    board.placeShip(validDestroyer);
    ['h2', 'h3', 'h4'].forEach((cell) =>
      expect(board.occupied).toContain(cell),
    );
  });
});

describe('receiveAttack tests', () => {
  board.placeShip(validCarrier);

  test('call hit() on successful attack', () => {
    let successfulHit = 'b2';
    expect(board.receiveAttack(successfulHit)).toBe(true);
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
    order66.forEach((hit) => board.receiveAttack(hit));
    expect(board.allSunk).toBe(true);
  });
});
