import EventBus from '../classes/eventbus.js';

let eventBus = new EventBus();
let events = {
  // NOTE: If used, data must be an object.

  newGame: (data) => {
    return new CustomEvent('new-game', { detail: data });
  },
  configReady: (data) => {
    return new CustomEvent('config-ready', { detail: data });
  },
  initFinished: (data) => {
    return new CustomEvent('init-finished', { detail: data });
  },
  shipAttemptPlacement: (data) => {
    return new CustomEvent('ship-attempt-placement', { detail: data });
  },
  shipConfirmPlacement: (data) => {
    return new CustomEvent('ship-confirm-placement', { detail: data });
  },
  gameStart: (data) => {
    return new CustomEvent('game-start', { detail: data });
  },
  attackSent: (data) => {
    return new CustomEvent('attack-sent', { detail: data });
  },
  attackConfirm: (data) => {
    return new CustomEvent('attack-confirm', { detail: data });
  },
  shipSunk: (data) => {
    return new CustomEvent('ship-sunk', { detail: data });
  },
  gameWon: (data) => {
    return new CustomEvent('game-won', { detail: data });
  },
};

export { eventBus, events };
