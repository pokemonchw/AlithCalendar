import { DebugLogger } from './DebugLogger';
import { Event } from './Event';

export enum SwipeDirection {
  TO_TOP,
  TO_RIGHT,
  TO_BOTTOM,
  TO_LEFT,
}

const gestureMinWidth = 900;

export const swipeEvent: Event<SwipeDirection> = new Event();
const horizontalMinXProportion = 0.17;
const horizontalMaxYProportion = 0.1;
const verticalMinYProportion = 0.1;
const verticalMaxPropotyion = 0.1;
const swipeTimeThreshold = 500;
let startX = 0;
let startY = 0;
let startTime = 0;
window.addEventListener('touchstart', event => {
  // Only listen for first touch starts
  if (event.touches.length !== 1) {
    return;
  }
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
  startTime = Date.now();
});
window.addEventListener('touchend', event => {
  // Only listen for last touch ends
  if (event.touches.length !== 0) {
    return;
  }
  // Ignore touches that lasted too long
  if (Date.now() - startTime > swipeTimeThreshold) {
    return;
  }
  if (window.innerWidth > gestureMinWidth) {
    return;
  }
  const deltaX = event.changedTouches[0].clientX - startX;
  const deltaY = event.changedTouches[0].clientY - startY;
  const xProportion = Math.abs(deltaX / window.innerWidth);
  const yProportion = Math.abs(deltaY / window.innerHeight);
  if (xProportion > horizontalMinXProportion && yProportion < horizontalMaxYProportion) {
    // Horizontal swipe detected
    if (deltaX > 0) {
      swipeEvent.emit(SwipeDirection.TO_RIGHT);
    } else {
      swipeEvent.emit(SwipeDirection.TO_LEFT);
    }
  } else if (yProportion > verticalMinYProportion && xProportion < verticalMaxPropotyion) {
    // Vertical swipe detected
    if (deltaY > 0) {
      swipeEvent.emit(SwipeDirection.TO_BOTTOM);
    } else {
      swipeEvent.emit(SwipeDirection.TO_TOP);
    }
  }
});
const swipeEventDebugLogger = new DebugLogger('swipeEvent');
swipeEvent.on(direction => {
  swipeEventDebugLogger.log(SwipeDirection[direction]);
});
