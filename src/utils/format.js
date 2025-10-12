export const formatPhone = phone => {
  if (!phone) {
    return '';
  }

  const cleaned = phone.replace(/\D/g, '');

  const truncated = cleaned.slice(0, 11);
  const { length } = truncated;

  if (length > 7) {
    return `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
  }
  if (length > 3) {
    return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
  }
  return truncated;
};
