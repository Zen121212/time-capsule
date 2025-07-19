export function getDaysLeft(revealDate) {
  if (!revealDate) return null;

  const reveal = new Date(revealDate);
  const today = new Date();

  reveal.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = reveal - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}
