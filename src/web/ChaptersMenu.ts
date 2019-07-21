import { Folder } from '../Data';
import { loadChapter, loadChapterEvent } from './chapterControl';
import { data } from './data';
import { updateHistory } from './history';
import { ItemHandle, Menu } from './Menu';
import { shortNumber } from './shortNumber';

const chapterSelectionButtonsMap: Map<string, ItemHandle> = new Map();
let currentLastReadLabelAt: HTMLSpanElement | null = null;

function attachLastReadLabelTo(button: ItemHandle, htmlRelativePath: string) {
  currentLastReadLabelAt = button.append('[上次阅读]');
}

loadChapterEvent.on(newChapterHtmlRelativePath => {
  if (currentLastReadLabelAt !== null) {
    currentLastReadLabelAt.remove();
  }
  attachLastReadLabelTo(chapterSelectionButtonsMap.get(newChapterHtmlRelativePath)!, newChapterHtmlRelativePath);
});

export class ChaptersMenu extends Menu {
  public constructor(parent: Menu, folder?: Folder) {
    if (folder === undefined) {
      folder = data.chapterTree;
    }
    super(folder.isRoot ? '章节选择' : folder.displayName, parent);
    for (const subfolder of folder.subFolders) {
      const handle = this.addLink(new ChaptersMenu(this, subfolder), true);
      handle.addClass('folder');
      handle.append(`[${shortNumber(subfolder.folderCharCount)}]`, 'char-count');
    }
    for (const chapter of folder.chapters) {
      const handle = this.addItem(chapter.displayName, { small: true, button: true })
        .onClick(() => {
          loadChapter(chapter.htmlRelativePath);
          updateHistory(true);
        });
      if (chapter.isEarlyAccess) {
        handle.prepend('[编写中]');
        handle.addClass('early-access');
      }
      handle.append(`[${shortNumber(chapter.chapterCharCount)}]`, 'char-count');

      const lastRead = window.localStorage.getItem('lastRead');
      if (lastRead === chapter.htmlRelativePath) {
        attachLastReadLabelTo(handle, chapter.htmlRelativePath);
      }

      chapterSelectionButtonsMap.set(chapter.htmlRelativePath, handle);
    }
  }
}
