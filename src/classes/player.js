import Gameboard from './gameboard.js';
import * as util from '../utility.js';

export default class Player {
  constructor({ side, name, isCPU }) {
    this.side = side;
    this.name = name;
    this.isCPU = isCPU;
    // TODO: CPU difficulty
    this.board = new Gameboard();
    this.enemyBoard = isCPU ? util.makeSquares() : null;
  }

  // TODO: should this be static?
  getCPUMove() {
    let index = util.random(this.enemyBoard.length);
    // console.log('CPU move: ', this.enemyBoard[index]);
    return this.enemyBoard.splice(index, 1).pop();
  }
}
