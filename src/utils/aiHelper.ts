export const generateAISuggestion = (cellValue: any, column: string): string => {
  if (column === 'amount') {
    return `Tip: Check if ₹${cellValue} exceeds budget or needs follow-up.`;
  } else if (column === 'status') {
    return cellValue === 'Pending'
      ? 'You can auto-remind the user with a follow-up email.'
      : 'No action needed.';
  } else if (column === 'name') {
    return `Lookup LinkedIn info for "${cellValue}"?`;
  }
  return 'No AI suggestion available.';
};
