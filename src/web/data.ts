import { Chapter, Data, Folder } from './../Data';
export const data = (window as any).DATA as Data;

export interface ChapterContext {
  folder: Folder;
  inFolderIndex: number;
  chapter: Chapter;
}

export const relativePathLookUpMap: Map<string, ChapterContext> = new Map();
function iterateFolder(folder: Folder) {
  folder.subFolders.forEach(subFolder => {
    iterateFolder(subFolder);
  });
  folder.chapters.forEach((chapter, index) => {
    relativePathLookUpMap.set(chapter.htmlRelativePath, {
      folder,
      chapter,
      inFolderIndex: index,
    });
  });
}
iterateFolder(data.chapterTree);
