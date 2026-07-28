// all date related helper functions will be defined here

// format date from calendar to string human readable
export const formatDate = (date: Date | undefined): string => {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// check if the date is valid
export const isValidDate = (date: Date | undefined): boolean => {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
};
