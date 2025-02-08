const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const sleep = (): Promise<void> =>
  new Promise((resolve) => {
    const delay = randomIntFromInterval(500, 1500);
    console.log('Sleeping...' + delay + ' ms...');
    setTimeout(resolve, delay);
  });
