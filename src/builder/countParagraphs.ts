export function countParagraphs(html: string) {
  let i = 0;
  let n = 0;
  while ((i = html.indexOf('<p>', i)) !== -1) {
    i += 3;
    n++;
  }
  return n;
}
