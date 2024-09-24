import Ship from '../classes/ship.js';

// BOILERPLATE
// beforeEach(() => {
//   let newShip = new Ship();
// });
// describe('', () => {});
// test('', () => {
//   expect().toBe();
// });

describe('new ship lengths', () => {
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
});

describe('ship damage and sinking tests', () => {
  let testShip;
  beforeEach(() => {
    testShip = new Ship('destroyer');
  });

  test('ship should start with zero hits', () => {
    expect(testShip.hits).toBe(0);
  });

  test('ship should start afloat', () => {
    expect(testShip.sunk).toBe(false);
  });

  test('hit() should increase hits', () => {
    testShip.hit();
    expect(testShip.hits).toBe(1);
  });

  test('ship should remain afloat if hits < len', () => {
    testShip.hit().hit();
    expect(testShip.sunk).toBe(false);
  });

  test('when hits equals length, ship should sink', () => {
    testShip.hit().hit().hit();
    expect(testShip.sunk).toBe(true);
  });

  test('hits should cap at ship length', () => {
    testShip.hit().hit().hit().hit();
    expect(testShip.hits).toBe(3);
  });
});
