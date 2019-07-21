import { ChapterContext } from './data';

export type Selection = [number, number, number, number];
interface State {
  currentChapter: ChapterContext | null;
  chapterSelection: Selection | null;
  chapterTextNodes: Array<Text> | null;
}
export const state: State = {
  currentChapter: null,
  chapterSelection: null,
  chapterTextNodes: null,
};
