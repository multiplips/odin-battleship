/** Creates an array of gameboard coordinates */
export function makeSquares() {
  let xAxis = 'abcdefghij'.split('');
  let yAxis = '0123456789'
    .split('')
    .map((y) => String(+y + 1).padStart(2, '0'));

  return yAxis.flatMap((y) => xAxis.map((x) => x + y));
}

/** Random number utility */
export function random(outcomes = 2) {
  if (outcomes % 1 || isNaN(outcomes % 1)) {
    throw new Error(`${outcomes}: invalid arg. type—must be an integer`);
  }

  return Math.floor(Math.random() * outcomes);
}
