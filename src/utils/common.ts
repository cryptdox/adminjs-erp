export function camelToTitleCase(text: string): string {
  if (!text) return '';

  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}
