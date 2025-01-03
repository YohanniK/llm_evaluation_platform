export const parseDate = (date: number) => {
  const d = new Date(date);
  return d.toDateString();
};
