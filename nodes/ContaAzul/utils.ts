export function toYYYYMMDD(dateString: string): string {
  if (!dateString) return '';
  return dateString.split('T')[0];
}
