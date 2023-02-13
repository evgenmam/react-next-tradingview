export const cur = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

export const per = (n: number) => `${(n * 100).toFixed(2)}%`;

export const val = (n: number) => Number(n.toFixed(2));
