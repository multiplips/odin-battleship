import Ship from '../classes/ship.js';

describe('new ship tests', () => {
  test.each([
    { ship: 'carrier', len: 5 },
    { ship: 'battleship', len: 4 },
    { ship: 'destroyer', len: 3 },
    { ship: 'submarine', len: 3 },
    { ship: 'patrol', len: 2 },
  ])('$ship should have length $len', ({ ship, len }) => {
    let newShip = new Ship(ship);
    expect(newShip.length).toBe(len);
  });

  let invalidShip = () => new Ship('runcible');
  test('invalid ship type throws', () => {
    expect(invalidShip).toThrow('Invalid ship');
  });
});

describe('ship damage and sinking tests', () => {
  let testShip;
  beforeEach(() => {
    testShip = new Ship('destroyer');
  });

  test('ship starts with zero hits', () => {
    expect(testShip.hits).toBe(0);
  });

  test('ship starts afloat', () => {
    expect(testShip.sunk).toBe(false);
  });

  test('hit() increases hits count', () => {
    testShip.hit();
    expect(testShip.hits).toBe(1);
  });

  test('ship remains afloat if hits < len', () => {
    testShip.hit().hit();
    expect(testShip.sunk).toBe(false);
  });

  test('when hits equals length, ship sinks', () => {
    testShip.hit().hit().hit();
    expect(testShip.sunk).toBe(true);
  });

  test('hit count caps at ship length', () => {
    testShip.hit().hit().hit().hit();
    expect(testShip.hits).toBe(3);
  });
});
