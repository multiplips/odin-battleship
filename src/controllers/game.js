import { eventBus, events } from './events.js';
import Player from '../classes/player.js';

let game;

eventBus.subscribe('config-ready', (event) => {
  // console.debug(`received: ${event.type}`);
  game = initGame(event.detail);
  // eventBus.publish(events.fleetLayoutReady(game));
  // console.debug(`ATT: ${game.attacker.name}`);
  eventBus.publish(events.initFinished());
});

eventBus.subscribe('game-start', () => {
  console.log(`${game.attacker.side}'s move`);
  if (game.attacker.isCPU) {
    console.log(game.attacker.enemyBoard);
    // TODO: roll attack sent handler into own function so we don't need to
    // emit here
    let promise = computerMove(game.attacker);
    promise.then((moveData) => {
      console.log('CPU Move Data:', moveData);
      eventBus.publish(events.attackSent(moveData));
    });
  }
});

eventBus.subscribe('attack-sent', (event) => {
  console.debug(`rec: ${event.type}`);
  let attackResult = checkAttack(event.detail);
  let gameIsOver = checkIfWinner(game.defender);

  if (!attackResult) return;
  eventBus.publish(events.attackConfirm(attackResult));
  if (gameIsOver) {
    return eventBus.publish(events.gameWon({ winner: game.attacker }));
  }

  game.nextRound();
  console.log(`${game.attacker.side}'s move`);

  if (game.attacker.isCPU) {
    let promise = computerMove(game.attacker);
    promise.then((moveData) => {
      console.log('CPU Move Data:', moveData);
      eventBus.publish(events.attackSent(moveData));
    });
  }
});

eventBus.subscribe('ship-attempt-placement', (event) => {
  let placementResult = checkPlacement(event.detail);
  if (!placementResult) return; // do nothing if placement fails
  eventBus.publish(events.shipConfirmPlacement(placementResult));
});

/** Initialized module-level game state variables. */
function initGame({ p1Name, p2Name, mode, first }) {
  let [p1CPU, p2CPU] =
    mode === 'cvc'
      ? [true, true]
      : mode === 'pvp'
        ? [false, false]
        : [false, true];

  let p1 = new Player({ side: 'p1', name: p1Name, isCPU: p1CPU });
  let p2 = new Player({ side: 'p2', name: p2Name, isCPU: p2CPU });

  return new Game({ p1, p2, first });
}

function checkPlacement({ side, ship, origin, heading }) {
  // console.log(game[side]);
  let placements = game[side].board.placeShip({ ship, origin, heading });
  return { side, ship, placements };
}

/**
 * Checks that an attack is valid then sends to the board.
 * Returns attack result, and whether a ship was sunk.
 */
function checkAttack({ side, square }) {
  // Square must not be empty, and attack must be against current enemy.
  if (!square || game[side] !== game.defender) return null;
  // NOTE: Not needed if add and remove target-specific click
  // event listener for attacks for each round.

  let lastCount = game.defender.board.sunk.length;
  let shotResult = game.defender.board.receiveAttack(square);
  let newSinking = game.defender.board.sunk.length > lastCount;
  return { side, square, shotResult, newSinking };
}

function checkIfWinner(player) {
  return player.board.allSunk;
}

async function computerMove(player) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  let side = player.side === 'p1' ? 'p2' : 'p1';
  let square = player.getCPUMove();
  return { side, square };
}

/** Constructs object to track players and turns. */
function Game({ p1, p2, first }) {
  this.p1 = p1;
  this.p2 = p2;
  this.attacker = first === 'p1' ? p1 : p2;
  this.defender = first === 'p1' ? p2 : p1;
}

Game.prototype = {
  nextRound: function () {
    [this.attacker, this.defender] = [this.defender, this.attacker];
  },
};
