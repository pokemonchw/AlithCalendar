import { Chapter } from '../Data';
import { hideComments, loadComments } from './commentsControl';
import { ContentBlockType } from './ContentBlockType';
import { relativePathLookUpMap } from './data';
import { DebugLogger } from './DebugLogger';
import { getTextNodes, id, selectNode } from './DOM';
import { Event } from './Event';
import { SwipeDirection, swipeEvent } from './gestures';
import { updateHistory } from './history';
import { ArrowKey, arrowKeyPressEvent } from './keyboard';
import { loadingText } from './loadingText';
import { RectMode, setRectMode } from './RectMode';
import { earlyAccess, gestureSwitchChapter } from './settings';
import { Selection, state } from './state';

const debugLogger = new DebugLogger('chapterControl');

const $content = id('content');
const chaptersCache = new Map<string, string | null>();

export const loadChapterEvent = new Event<string>();

export function closeChapter() {
  setRectMode(RectMode.OFF);
  state.currentChapter = null;
  state.chapterSelection = null;
  state.chapterTextNodes = null;
}

const select = ([
  anchorNodeIndex,
  anchorOffset,
  focusNodeIndex,
  focusOffset,
]: Selection) => {
  if (state.chapterTextNodes === null) {
    return;
  }
  const anchorNode = state.chapterTextNodes[anchorNodeIndex];
  const focusNode = state.chapterTextNodes[focusNodeIndex];
  if (anchorNode === undefined || focusNode === undefined) {
    return;
  }
  document.getSelection()!.setBaseAndExtent(
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  );
  const element = anchorNode.parentElement;
  if (element !== null && (typeof element.scrollIntoView) === 'function') {
    element.scrollIntoView();
  }
};

const getFlexOneSpan = () => {
  const $span = document.createElement('span');
  $span.style.flex = '1';
  return $span;
};

const canChapterShown = (chapter: Chapter) =>
  earlyAccess.getValue() || !chapter.isEarlyAccess;

const createContentBlock = (type: ContentBlockType, title: string, text: string) => {
  const $block = document.createElement('div');
  $block.classList.add('block', type);
  const $title = document.createElement('h1');
  $title.innerText = title;
  $block.appendChild($title);
  const $text = document.createElement('p');
  $text.innerText = text;
  $block.appendChild($text);
  return $block;
};

export function loadPrevChapter() {
  const chapterCtx = state.currentChapter;
  if (chapterCtx === null) {
    return;
  }
  const chapterIndex = chapterCtx.inFolderIndex;
  if (chapterIndex >= 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex - 1])) {
    const prevChapter = chapterCtx.folder.chapters[chapterIndex - 1].htmlRelativePath;
    loadChapter(prevChapter);
    updateHistory(true);
  }
}

export function loadNextChapter() {
  const chapterCtx = state.currentChapter;
  if (chapterCtx === null) {
    return;
  }
  const chapterIndex = chapterCtx.inFolderIndex;
  if (chapterIndex < chapterCtx.folder.chapters.length - 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex + 1])) {
    const nextChapter = chapterCtx.folder.chapters[chapterIndex + 1].htmlRelativePath;
    loadChapter(nextChapter);
    updateHistory(true);
  }
}

const finalizeChapterLoading = (selection?: Selection) => {
  state.chapterTextNodes = getTextNodes($content);
  if (selection !== undefined) {
    if (id('warning') === null) {
      select(selection);
    } else {
      id('warning').addEventListener('click', () => {
        select(selection);
      });
    }
  }

  Array.from($content.getElementsByTagName('a')).forEach($anchor => ($anchor as HTMLAnchorElement).target = '_blank');
  Array.from($content.getElementsByTagName('code')).forEach($code => $code.addEventListener('dblclick', () => {
    selectNode($code);
  }));

  const chapterCtx = state.currentChapter!;
  const chapterIndex = chapterCtx.inFolderIndex;

  if (chapterCtx.chapter.isEarlyAccess) {
    const $block = createContentBlock('earlyAccess', '编写中章节', '请注意，本文正在编写中，因此可能会含有未完成的句子或是尚未更新的信息。');
    $content.prepend($block);
  }

  const $div = document.createElement('div');
  $div.style.display = 'flex';
  if (chapterIndex >= 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex - 1])) {
    const prevChapter = chapterCtx.folder.chapters[chapterIndex - 1].htmlRelativePath;
    const $prevLink = document.createElement('a');
    $prevLink.innerText = '上一章';
    $prevLink.href = `${window.location.pathname}#${prevChapter}`;
    $prevLink.style.textAlign = 'left';
    $prevLink.style.flex = '1';
    $prevLink.addEventListener('click', event => {
      event.preventDefault();
      loadPrevChapter();
    });
    $div.appendChild($prevLink);
  } else {
    $div.appendChild(getFlexOneSpan());
  }
  const $menuLink = document.createElement('a');
  $menuLink.innerText = '返回菜单';
  $menuLink.href = window.location.pathname;
  $menuLink.style.textAlign = 'center';
  $menuLink.style.flex = '1';
  $menuLink.addEventListener('click', event => {
    event.preventDefault();
    closeChapter();
    updateHistory(true);
  });
  $div.appendChild($menuLink);
  if (chapterIndex < chapterCtx.folder.chapters.length - 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex + 1])) {
    const nextChapter = chapterCtx.folder.chapters[chapterIndex + 1].htmlRelativePath;
    const $nextLink = document.createElement('a');
    $nextLink.innerText = '下一章';
    $nextLink.href = `${window.location.pathname}#${nextChapter}`;
    $nextLink.style.textAlign = 'right';
    $nextLink.style.flex = '1';
    $nextLink.addEventListener('click', event => {
      event.preventDefault();
      loadNextChapter();
    });
    $div.appendChild($nextLink);
  } else {
    $div.appendChild(getFlexOneSpan());
  }
  $content.appendChild($div);

  loadComments(chapterCtx.chapter.commentsUrl);

  // fix for stupid scrolling issues under iOS
  id('rect').style.overflow = 'hidden';
  setTimeout(() => {
    id('rect').style.overflow = null;
    if (selection === undefined) {
      id('rect').scrollTo(0, 0);
    }
  }, 1);

  // Re-focus the rect so it is arrow-scrollable
  setTimeout(() => {
    id('rect').focus();
  }, 1);
};

swipeEvent.on(direction => {
  if (!gestureSwitchChapter.getValue()) {
    return;
  }
  if (direction === SwipeDirection.TO_RIGHT) {
    // 上一章
    loadPrevChapter();
  } else if (direction === SwipeDirection.TO_LEFT) {
    // 下一章
    loadNextChapter();
  }
});

arrowKeyPressEvent.on(arrowKey => {
  if (arrowKey === ArrowKey.LEFT) {
    loadPrevChapter();
  } else if (arrowKey === ArrowKey.RIGHT) {
    loadNextChapter();
  }
});

export function loadChapter(chapterHtmlRelativePath: string, selection?: Selection) {
  debugLogger.log('Load chapter', chapterHtmlRelativePath, 'selection', selection);
  hideComments();
  loadChapterEvent.emit(chapterHtmlRelativePath);
  window.localStorage.setItem('lastRead', chapterHtmlRelativePath);
  setRectMode(RectMode.MAIN);
  const chapterCtx = relativePathLookUpMap.get(chapterHtmlRelativePath)!;
  state.currentChapter = chapterCtx;
  if (chaptersCache.has(chapterHtmlRelativePath)) {
    if (chaptersCache.get(chapterHtmlRelativePath) === null) {
      $content.innerText = loadingText;
    } else {
      $content.innerHTML = chaptersCache.get(chapterHtmlRelativePath)!;
      finalizeChapterLoading(selection);
    }
  } else {
    $content.innerText = loadingText;
    fetch(`./chapters/${chapterHtmlRelativePath}`)
      .then(response => response.text())
      .then(text => {
        chaptersCache.set(chapterHtmlRelativePath, text);
        if (chapterCtx === state.currentChapter) {
          $content.innerHTML = text;
          finalizeChapterLoading(selection);
        }
      });
  }
  return true;
}
