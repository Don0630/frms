export function validateDistributionAmount(amount, availableAmount) {
  const available = parseFloat(availableAmount) || 0;
  const newAmount = parseFloat(amount) || 0;

  if (available <= 0) {
    return "No available amount left for this distribution.";
  }
  if (newAmount > available) {
    return `Amount exceeds available amount. Available: ₱${available.toLocaleString()}`;
  }
  return null;
}