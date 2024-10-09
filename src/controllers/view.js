import { eventBus, events } from './events.js';
import { makeSquares, random } from '../utility.js';

// INFO: initialize common and static elements
['.p1', '.p2'].forEach((side) => {
  ['.base-layer', '.fleet-layer', '.peg-layer', '.targeting-layer'].forEach(
    (layer) => addLayerSquares({ side, layer }),
  );
});

let mode; // NOTE: needed to track how to render/hide boards

// INFO: placeholder to kick things off
// (will be triggered in final version by clicking new game button)
// convert to regular click listener—may not even need newGame event in the end
eventBus.subscribe('new-game', (event) => {
  // console.debug(`rec: ${event.type}`);
  let players = gameConfig();
  mode = players.mode;
  eventBus.publish(events.configReady(players));
});

eventBus.subscribe('init-finished', (event) => {
  // console.debug(`rec: ${event.type}`);
  addAttackListener();
});

eventBus.subscribe('ship-confirm-placement', (event) => {
  drawShip(event.detail);
});

eventBus.subscribe('attack-confirm', (event) => {
  // console.debug(`rec: ${event.type}`);
  drawPeg(event.detail);
});

eventBus.subscribe('game-won', (event) => {
  freezeBoard();
  console.debug(`rec: ${event.type}`);
  // WIN EVENT
  //  -> gameloop.terminate
  //  -> view.drawWinnerMessage
  //  -> reset any state with gameloop?
  console.log(`Winner: ${event.detail.winner}`);
});

// function attemptPlacement({ side, ship, origin, heading }) {
//   eventBus.publish(
//     events.shipAttemptPlacement({ side, ship, origin, heading }),
//   );
// }

/** Gathers game setup data (e.g., player names, types). */
function gameConfig() {
  // WARNING: placeholders only; plan to get these via form, etc.
  let p1Name = 'Able Baker';
  let p2Name = 'Charlie Dog';
  let mode = 'pvc';
  let first = random() === 0 ? 'p1' : 'p2';
  return { p1Name, p2Name, mode, first };
}

function addLayerSquares({ side, layer }) {
  let squares = makeSquares();
  let node = document.querySelector(`section${side} div${layer}`);
  let divs = squares.map((square) => {
    let div = document.createElement('div');
    if (layer !== '.base-layer') div.setAttribute('data-square', square);
    return div;
  });

  node.append(...divs);
}

function addAttackListener() {
  // TODO: simplify to one listener on a parent element?
  // ['.p1', '.p2'].forEach((side) => {
  let main = document.querySelector('main');
  main.addEventListener('click', attackClickListener);
  // }
  // );
}

function attackClickListener(event) {
  console.log(event);
  let side = event.target.closest('section').className;
  let square = event.target.dataset.square;
  eventBus.publish(events.attackSent({ side, square }));
}

/** Removes listeners and hover classes when game is over. */
function freezeBoard() {
  let main = document.querySelector('main');
  let targetingLayers = document.querySelectorAll('.targeting-layer');
  targetingLayers.forEach((node) => node.remove());
  main.removeEventListener('click', attackClickListener);
}

// TODO: newSinking unused
function drawPeg({ side, square, shotResult, newSinking }) {
  switch (shotResult) {
    case 'undefined':
      console.debug(`drawPeg: ${shotResult} `);
      break;
    case 'duplicate':
    case 'invalid':
      console.debug(`drawPeg: ${shotResult} `);
      break;
    case 'hit':
    case 'miss':
      console.debug(`drawPeg: ${shotResult} `);
      let query = `.${side} .peg-layer div[data-square="${square}"]`;
      let attackedSquare = document.querySelector(query);
      attackedSquare.classList.add(shotResult);
      break;
    default:
  }
}

// TODO: unused arg ship
function drawShip({ side, ship, placements }) {
  let fleetLayer = document.querySelector(`.${side} .fleet-layer`);
  placements.map((square) => {
    let query = `.${side} .fleet-layer div[data-square="${square}"]`;
    let placedSquare = document.querySelector(query);
    placedSquare.classList.add('ship');
  });
}

// function renderFleetX({ player, shipPositions }) {
//   let board = player.gameboard;
//   let fleetLayer = document.querySelector(`.${player.side} .fleet-layer`);
//
//   shipPositions.forEach((position) => {
//     let placeShipReturn = board.placeShip(position);
//     if (Array.isArray(placeShipReturn) && placeShipReturn.length > 0) {
//       placeShipReturn.forEach((sq) => {
//         // NOTE: DO NOT want to render enemy ships while game is in play
//         // implemented here for testing
//         let square = fleetLayer.querySelector(`div[data-coord="${sq}"]`);
//         square.classList.add('ship');
//       });
//     } else {
//       console.error(`Issue placing ${position.ship}.`);
//     }
//   });
// }
