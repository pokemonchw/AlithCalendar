import { DebugLogger } from './DebugLogger';
import { id } from './DOM';
import { Event } from './Event';

export enum RectMode {
  SIDE,
  MAIN,
  OFF,
}

const $rect = id('rect');

const debugLogger = new DebugLogger('RectMode');

export const rectModeChangeEvent = new Event<{
  previousRectMode: RectMode,
  newRectMode: RectMode,
}>();

let rectMode: RectMode = RectMode.OFF;
export function setRectMode(newRectMode: RectMode) {
  debugLogger.log(`${RectMode[rectMode]} -> ${RectMode[newRectMode]}`);

  if (rectMode === newRectMode) {
    return;
  }

  if (newRectMode === RectMode.OFF) {
    $rect.classList.remove('reading');
  } else {
    if (rectMode === RectMode.MAIN) {
      $rect.classList.remove('main');
    } else if (rectMode === RectMode.SIDE) {
      $rect.classList.remove('side');
    } else {
      $rect.classList.remove('main', 'side');
      $rect.classList.add('reading');
    }
    if (newRectMode === RectMode.MAIN) {
      $rect.classList.add('main');
    } else {
      $rect.classList.add('side');
    }
  }
  rectModeChangeEvent.emit({
    previousRectMode: rectMode,
    newRectMode,
  });
  rectMode = newRectMode;
}
