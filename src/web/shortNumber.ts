export function shortNumber(input: number) {
  if (input < 1000) {
    return String(input);
  }
  if (input < 1000_000) {
    return (input / 1000).toFixed(1) + 'k';
  }
  return (input / 1000_000).toFixed(1) + 'M';
}
