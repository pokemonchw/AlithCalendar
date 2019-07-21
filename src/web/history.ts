import { state } from './state';

export function getTitle() {
  let title = '阿里夫编年史';
  if (state.currentChapter !== null) {
    title += ' - ' + state.currentChapter.chapter.displayName;
  }
  return title;
}

export function updateHistory(push: boolean) {
  const method = push ? window.history.pushState : window.history.replaceState;
  let query = window.location.pathname;
  if (state.currentChapter !== null) {
    if (state.chapterSelection !== null) {
      query += `?selection=${state.chapterSelection.join(',')}`;
    }
    query += '#' + state.currentChapter.chapter.htmlRelativePath;

  }
  const title = getTitle();
  document.title = title;
  method.call(window.history, null, title, query);
}
