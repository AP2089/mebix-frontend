"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDimensions, formatPrice } from "@/lib/format";
import { calculateUnitPrice, createCartItemId, isValidDimension } from "@/lib/pricing";
import { useCalculatePriceMutation } from "@/store/api";
import { addItem, updateItem } from "@/store/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import type { ProductDetail } from "@/types/catalog";

interface Props {
  product: ProductDetail;
  editItemId?: string;
  initial?: {
    width: number;
    height: number;
    depth: number;
    materialId: number;
    colorId: number;
    quantity: number;
  };
}

export function FurnitureConfigurator({ product, editItemId, initial }: Props) {
  const t = useTranslations("product");
  const dispatch = useAppDispatch();
  const [calculatePrice, { data: serverPrice, error: priceError, isLoading: pricing }] =
    useCalculatePriceMutation();

  const defaultMaterialId = initial?.materialId ?? product.materials[0]?.id ?? 0;
  const defaultColorId = initial?.colorId ?? product.colors[0]?.id ?? 0;

  const [width, setWidth] = useState(initial?.width ?? product.base_width);
  const [height, setHeight] = useState(initial?.height ?? product.base_height);
  const [depth, setDepth] = useState(initial?.depth ?? product.base_depth);
  const [materialId, setMaterialId] = useState(defaultMaterialId);
  const [colorId, setColorId] = useState(defaultColorId);
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [message, setMessage] = useState<string | null>(null);

  const material = product.materials.find((item) => item.id === materialId) ?? product.materials[0];
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];

  const localErrors = useMemo(() => {
    const errors: string[] = [];
    if (!isValidDimension(width, product.min_width, product.max_width, product.size_step)) {
      errors.push(
        t("errorWidth", {
          min: product.min_width,
          max: product.max_width,
          step: product.size_step,
        }),
      );
    }
    if (!isValidDimension(height, product.min_height, product.max_height, product.size_step)) {
      errors.push(
        t("errorHeight", {
          min: product.min_height,
          max: product.max_height,
          step: product.size_step,
        }),
      );
    }
    if (!isValidDimension(depth, product.min_depth, product.max_depth, product.size_step)) {
      errors.push(
        t("errorDepth", {
          min: product.min_depth,
          max: product.max_depth,
          step: product.size_step,
        }),
      );
    }
    if (!material || !color) errors.push(t("errorMaterialColor"));
    if (quantity < 1 || quantity > 100) errors.push(t("errorQuantity"));
    return errors;
  }, [width, height, depth, material, color, quantity, product, t]);

  const previewUnit = useMemo(() => {
    if (!material || !color) return Number(product.base_price);
    return calculateUnitPrice({
      basePrice: Number(product.base_price),
      width,
      height,
      depth,
      baseWidth: product.base_width,
      baseHeight: product.base_height,
      baseDepth: product.base_depth,
      materialMultiplier: Number(material.price_multiplier),
      colorMultiplier: Number(color.price_multiplier),
    });
  }, [product, width, height, depth, material, color]);

  useEffect(() => {
    if (localErrors.length > 0 || !material || !color) return;

    const timer = setTimeout(() => {
      void calculatePrice({
        product_id: product.id,
        width,
        height,
        depth,
        material_id: material.id,
        color_id: color.id,
        quantity,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [
    calculatePrice,
    product.id,
    width,
    height,
    depth,
    material,
    color,
    quantity,
    localErrors.length,
  ]);

  const unitPrice = serverPrice?.pricing.unit_price ?? previewUnit.toFixed(2);
  const lineTotal =
    serverPrice?.pricing.line_total ?? (Number(unitPrice) * quantity).toFixed(2);

  function resetParams() {
    setWidth(product.base_width);
    setHeight(product.base_height);
    setDepth(product.base_depth);
    setMaterialId(product.materials[0]?.id ?? 0);
    setColorId(product.colors[0]?.id ?? 0);
    setQuantity(1);
    setMessage(null);
  }

  async function handleAddToCart() {
    if (localErrors.length || !material || !color) return;

    try {
      const validated = await calculatePrice({
        product_id: product.id,
        width,
        height,
        depth,
        material_id: material.id,
        color_id: color.id,
        quantity,
      }).unwrap();

      const item = {
        id: createCartItemId({
          productId: product.id,
          width,
          height,
          depth,
          materialId: material.id,
          colorId: color.id,
        }),
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        imageUrl: product.image_urls[0] ?? "",
        width,
        height,
        depth,
        materialId: material.id,
        materialName: material.name,
        colorId: color.id,
        colorName: color.name,
        colorHex: color.hex_code,
        quantity,
        unitPrice: validated.pricing.unit_price,
        lineTotal: validated.pricing.line_total,
      };

      if (editItemId) {
        dispatch(updateItem({ oldId: editItemId, item }));
        setMessage(t("updated"));
      } else {
        dispatch(addItem(item));
        setMessage(t("added"));
      }
    } catch {
      setMessage(t("priceFailed"));
    }
  }

  const image = product.image_urls[0];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden bg-mebix-beige">
        <SafeImage
          src={image}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-mebix-graphite/50">
            {product.category.name}
          </p>
          <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-mebix-graphite/75">{product.description}</p>
        </div>

        <section aria-labelledby="size-heading" className="space-y-3">
          <h2 id="size-heading" className="text-sm font-medium uppercase tracking-wider">
            {t("sizes")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <DimensionField
              id="width"
              label={t("width")}
              value={width}
              min={product.min_width}
              max={product.max_width}
              step={product.size_step}
              onChange={setWidth}
              rangeHint={t("rangeHint", {
                min: product.min_width,
                max: product.max_width,
                step: product.size_step,
              })}
            />
            <DimensionField
              id="height"
              label={t("height")}
              value={height}
              min={product.min_height}
              max={product.max_height}
              step={product.size_step}
              onChange={setHeight}
              rangeHint={t("rangeHint", {
                min: product.min_height,
                max: product.max_height,
                step: product.size_step,
              })}
            />
            <DimensionField
              id="depth"
              label={t("depth")}
              value={depth}
              min={product.min_depth}
              max={product.max_depth}
              step={product.size_step}
              onChange={setDepth}
              rangeHint={t("rangeHint", {
                min: product.min_depth,
                max: product.max_depth,
                step: product.size_step,
              })}
            />
          </div>
          <p className="text-xs text-mebix-graphite/60">
            {t("baseSize", {
              dims: formatDimensions(product.base_width, product.base_height, product.base_depth),
            })}
          </p>
        </section>

        <section aria-labelledby="material-heading" className="space-y-3">
          <h2 id="material-heading" className="text-sm font-medium uppercase tracking-wider">
            {t("material")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMaterialId(item.id)}
                className={`min-h-11 cursor-pointer border px-3 py-2 text-sm ${
                  materialId === item.id
                    ? "border-mebix-graphite bg-mebix-graphite text-mebix-milk"
                    : "border-mebix-beige bg-mebix-white hover:border-mebix-wood"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="color-heading" className="space-y-3">
          <h2 id="color-heading" className="text-sm font-medium uppercase tracking-wider">
            {t("color")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setColorId(item.id)}
                className={`flex min-h-11 cursor-pointer items-center gap-2 border px-3 py-2 text-sm ${
                  colorId === item.id
                    ? "border-mebix-graphite"
                    : "border-mebix-beige hover:border-mebix-wood"
                }`}
                aria-label={item.name}
              >
                <span
                  className="inline-block h-5 w-5 border border-black/10"
                  style={{ backgroundColor: item.hex_code }}
                  aria-hidden
                />
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <div>
          <label
            htmlFor="quantity"
            className="mb-1 block text-sm font-medium uppercase tracking-wider"
          >
            {t("quantity")}
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="min-h-11 w-28 border border-mebix-beige bg-mebix-white px-3"
          />
        </div>

        <div className="space-y-2 border-t border-mebix-beige pt-4">
          <div className="flex justify-between text-sm text-mebix-graphite/70">
            <span>{t("basePrice")}</span>
            <span>{formatPrice(product.base_price)}</span>
          </div>
          {serverPrice ? (
            <>
              <div className="flex justify-between text-sm text-mebix-graphite/70">
                <span>{t("sizeFactor")}</span>
                <span>×{serverPrice.pricing.size_factor}</span>
              </div>
              <div className="flex justify-between text-sm text-mebix-graphite/70">
                <span>{t("materialColor")}</span>
                <span>
                  ×{serverPrice.pricing.material_multiplier} / ×
                  {serverPrice.pricing.color_multiplier}
                </span>
              </div>
            </>
          ) : null}
          <div className="flex justify-between text-base font-medium">
            <span>{t("unitPrice")}</span>
            <span>{pricing ? "…" : formatPrice(unitPrice)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>{t("total")}</span>
            <span>{pricing ? "…" : formatPrice(lineTotal)}</span>
          </div>
        </div>

        {localErrors.length > 0 ? (
          <ul className="space-y-1 text-sm text-red-700" role="alert">
            {localErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}

        {priceError ? (
          <p className="text-sm text-red-700" role="alert">
            {t("serverRejected")}
          </p>
        ) : null}

        {message ? <p className="text-sm text-mebix-wood">{message}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => void handleAddToCart()}
            disabled={localErrors.length > 0 || pricing || !product.is_available}
            className="flex-1"
          >
            {editItemId ? t("saveInCart") : t("addToCart")}
          </Button>
          <Button variant="secondary" onClick={resetParams} className="flex-1">
            {t("resetParams")}
          </Button>
        </div>
        <Button variant="ghost" href="/catalog" className="px-0">
          {t("backToCatalog")}
        </Button>
        {editItemId ? (
          <Link href="/cart" className="block text-sm text-mebix-wood hover:underline">
            {t("toCart")}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function DimensionField({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  rangeHint,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  rangeHint: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-mebix-graphite/60">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-h-11 w-full border border-mebix-beige bg-mebix-white px-3 text-sm"
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="mt-1 text-xs text-mebix-graphite/50">
        {rangeHint}
      </p>
    </div>
  );
}
