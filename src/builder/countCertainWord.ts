export function countCertainWord(markdown: string, word: string) {
  let count = 0;
  let pointer = 0;
  while ((pointer = markdown.indexOf(word, pointer)) !== -1) {
    count++;
    pointer += word.length;
  }
  return count;
}
