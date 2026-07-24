// artificial wait and deplay function for testing

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
