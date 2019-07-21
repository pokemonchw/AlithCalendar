import { updateHistory } from './history';
import { state } from './state';

export function updateSelection() {
  if (state.chapterTextNodes === null) {
    return;
  }
  const before = String(state.chapterSelection);
  const selection = document.getSelection();
  if (selection === null) {
    state.chapterSelection = null;
  } else {
    const anchor = ((selection.anchorNode instanceof HTMLElement)
      ? selection.anchorNode.firstChild
      : selection.anchorNode) as Text;
    const anchorNodeIndex = state.chapterTextNodes.indexOf(anchor);
    const focus = ((selection.focusNode instanceof HTMLElement)
      ? selection.focusNode.firstChild
      : selection.focusNode) as Text;
    const focusNodeIndex = state.chapterTextNodes.indexOf(focus);
    if (
      (anchorNodeIndex === -1) || (focusNodeIndex === -1) ||
      (anchorNodeIndex === focusNodeIndex && selection.anchorOffset === selection.focusOffset)
    ) {
      state.chapterSelection = null;
    } else {
      if (
        (anchorNodeIndex < focusNodeIndex) ||
        (anchorNodeIndex === focusNodeIndex && selection.anchorOffset < selection.focusOffset)
      ) {
        state.chapterSelection = [
          anchorNodeIndex,
          selection.anchorOffset,
          focusNodeIndex,
          selection.focusOffset,
        ];
      } else {
        state.chapterSelection = [
          focusNodeIndex,
          selection.focusOffset,
          anchorNodeIndex,
          selection.anchorOffset,
        ];
      }
    }
  }
  if (before !== String(state.chapterSelection)) {
    updateHistory(false);
  }
}
