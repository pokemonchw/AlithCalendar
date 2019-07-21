export interface Node {
  displayName: string;
  displayIndex: number;
  name: string;
  sourceRelativePath: string;
}

export interface Chapter extends Node {
  isEarlyAccess: boolean;
  commentsUrl: string | null;
  htmlRelativePath: string;
  chapterCharCount: number;
}

export interface Folder extends Node {
  chapters: Array<Chapter>;
  subFolders: Array<Folder>;
  isRoot: boolean;
  folderCharCount: number;
}

export interface Data {
  chapterTree: Folder;
  charsCount: number;
  paragraphsCount: number;
  keywordsCount: Array<[string, number]>;
  buildNumber: string;
}
