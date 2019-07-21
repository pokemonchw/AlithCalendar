import { closeChapter, loadChapter } from './chapterControl';
import { relativePathLookUpMap } from './data';
import { getTitle } from './history';
import { state } from './state';

export function followQuery() {
  const chapterHtmlRelativePath = decodeURIComponent(window.location.hash.substr(1)); // Ignore the # in the result
  const chapterCtx = relativePathLookUpMap.get(chapterHtmlRelativePath);
  if (chapterCtx === undefined) {
    if (state.currentChapter !== null) {
      closeChapter();
      document.title = getTitle();
    }
    return;
  }
  if (state.currentChapter !== chapterCtx) {
    if (typeof URLSearchParams !== 'function') {
      loadChapter(chapterHtmlRelativePath);
    } else {
      const query = new URLSearchParams(window.location.search);
      const selectionQuery = query.get('selection');
      const selection: Array<number> = selectionQuery !== null
        ? selectionQuery.split(',').map(str => +str)
        : [];
      if (selection.length !== 4 || !selection.every(
        num => (num >= 0) && (num % 1 === 0) && (!Number.isNaN(num)) && (Number.isFinite(num)),
      )) {
        loadChapter(chapterHtmlRelativePath);
      } else {
        loadChapter(chapterHtmlRelativePath, selection as [number, number, number, number]);
      }
      document.title = getTitle();
    }
  }
}
