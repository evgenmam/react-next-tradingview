export const cur = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

export const val = (n: number) => Number(n.toFixed(2));
