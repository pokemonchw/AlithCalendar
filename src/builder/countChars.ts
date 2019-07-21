const ignored = ' \n\t#*';
export function countChars(markdown: string) {
  let n = 0;
  for (let i = 0; i < markdown.length; i++) {
    if (!ignored.includes(markdown[i])) {
      n++;
    }
  }
  return n;
}
