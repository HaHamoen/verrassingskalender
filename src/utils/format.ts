export function formatPrice(amount: number): string {
  if (amount >= 1000) {
    return `${amount / 1000}k`;
  }
  return amount.toString();
}
