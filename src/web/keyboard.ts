import { DebugLogger } from './DebugLogger';
import { Event } from './Event';

export enum ArrowKey {
  LEFT,
  UP,
  RIGHT,
  DOWN,
}

export const arrowKeyPressEvent = new Event<ArrowKey>();
document.addEventListener('keyup', event => {
  switch (event.keyCode) {
    case 37:
      arrowKeyPressEvent.emit(ArrowKey.LEFT);
      break;
    case 38:
      arrowKeyPressEvent.emit(ArrowKey.UP);
      break;
    case 39:
      arrowKeyPressEvent.emit(ArrowKey.RIGHT);
      break;
    case 40:
      arrowKeyPressEvent.emit(ArrowKey.DOWN);
      break;
  }
});

const arrowEventDebugLogger = new DebugLogger('arrowKeyEvent');
arrowKeyPressEvent.on(arrowKey => {
  arrowEventDebugLogger.log(ArrowKey[arrowKey]);
});
