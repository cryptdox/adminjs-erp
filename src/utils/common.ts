export function camelToTitleCase(text: string): string {
  if (!text) return '';

  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}

export function generateRandomCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getUsernameFromEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.split('@')[0].toLowerCase().trim();
}

export function getDateAfterDays(count = 30, date = new Date()) {
  const futureDate = new Date(date);
  futureDate.setDate(futureDate.getDate() + count);
  return futureDate;
}
