export function calculateSizeFactor(
  width: number,
  height: number,
  depth: number,
  baseWidth: number,
  baseHeight: number,
  baseDepth: number,
): number {
  const numerator = width * height * depth;
  const denominator = baseWidth * baseHeight * baseDepth;
  if (denominator <= 0) return 1;
  return Number((numerator / denominator).toFixed(4));
}

export function calculateUnitPrice(params: {
  basePrice: number;
  width: number;
  height: number;
  depth: number;
  baseWidth: number;
  baseHeight: number;
  baseDepth: number;
  materialMultiplier: number;
  colorMultiplier: number;
}): number {
  const sizeFactor = calculateSizeFactor(
    params.width,
    params.height,
    params.depth,
    params.baseWidth,
    params.baseHeight,
    params.baseDepth,
  );
  const unit =
    params.basePrice * sizeFactor * params.materialMultiplier * params.colorMultiplier;
  return Math.round(unit * 100) / 100;
}

export function isValidDimension(
  value: number,
  min: number,
  max: number,
  step: number,
): boolean {
  if (value < min || value > max) return false;
  return (value - min) % step === 0;
}

export function createCartItemId(parts: {
  productId: number;
  width: number;
  height: number;
  depth: number;
  materialId: number;
  colorId: number;
}): string {
  return [
    parts.productId,
    parts.width,
    parts.height,
    parts.depth,
    parts.materialId,
    parts.colorId,
  ].join("-");
}
