type Weights = Record<string, number>;

export const pickWeighted = (weights: Weights): string => {
  const entries = Object.entries(weights);
  const total = entries.reduce((acc, [, weight]) => acc + weight, 0);
  let random = Math.random() * total;

  for (const [symbol, weight] of entries) {
    random -= weight;
    if (random <= 0) return symbol;
  }

  return entries[entries.length - 1][0];
};
