export const cur = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

export const per = (n: number) => `${(n * 100).toFixed(2)}%`;

export const val = (n: number) => Number(n.toFixed(2));

export const addPercent = (p: number) => (n: number) =>
  p > 1 ? n + (n * p) / 100 : n + n * p;

export const subPercent = (p: number) => (n: number) =>
  p > 1 ? n - (n * p) / 100 : n - n * p;
