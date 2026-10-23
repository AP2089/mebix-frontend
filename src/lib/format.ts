export function formatPrice(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDimensions(width: number, height: number, depth: number): string {
  return `${width} × ${height} × ${depth} мм`;
}
