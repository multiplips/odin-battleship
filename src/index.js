// import * as view from './controllers/view.js';
import './style.css';
import { eventBus, events } from './controllers/events.js';
import './controllers/view.js';
import './controllers/game.js';

eventBus.publish(events.newGame());
let p1Layout = [
  { side: 'p1', ship: 'carrier', origin: 'b03', heading: 'n' },
  { side: 'p1', ship: 'battleship', origin: 'i09', heading: 's' },
  { side: 'p1', ship: 'destroyer', origin: 'e04', heading: 'n' },
  { side: 'p1', ship: 'submarine', origin: 'i02', heading: 'e' },
  { side: 'p1', ship: 'patrol', origin: 'j06', heading: 'n' },
];
let p2Layout = [
  { side: 'p2', ship: 'carrier', origin: 'h04', heading: 'e' },
  { side: 'p2', ship: 'battleship', origin: 'c03', heading: 'n' },
  { side: 'p2', ship: 'destroyer', origin: 'g08', heading: 'e' },
  { side: 'p2', ship: 'submarine', origin: 'e07', heading: 's' },
  { side: 'p2', ship: 'patrol', origin: 'd05', heading: 'w' },
];
p1Layout.forEach((layout) => {
  eventBus.publish(events.shipAttemptPlacement(layout));
});
p2Layout.forEach((layout) => {
  eventBus.publish(events.shipAttemptPlacement(layout));
});
eventBus.publish(events.gameStart());
