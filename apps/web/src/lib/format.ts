export function formatScore(value: number): string {
  return value.toFixed(2);
}

export function asDate(value: Date | string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID');
}
