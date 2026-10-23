"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDimensions, formatPrice } from "@/lib/format";
import { useCalculatePriceMutation } from "@/store/api";
import {
  clearCart,
  removeItem,
  replacePrices,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CartView() {
  const t = useTranslations("cart");
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const [calculatePrice] = useCalculatePriceMutation();
  const [syncNote, setSyncNote] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    let cancelled = false;

    async function refreshPrices() {
      try {
        const updates = await Promise.all(
          items.map(async (item) => {
            const result = await calculatePrice({
              product_id: item.productId,
              width: item.width,
              height: item.height,
              depth: item.depth,
              material_id: item.materialId,
              color_id: item.colorId,
              quantity: item.quantity,
            }).unwrap();
            return {
              id: item.id,
              unitPrice: result.pricing.unit_price,
              lineTotal: result.pricing.line_total,
            };
          }),
        );
        if (!cancelled) {
          dispatch(replacePrices(updates));
          setSyncNote(t("pricesSynced"));
        }
      } catch {
        if (!cancelled) {
          setSyncNote(t("pricesFailed"));
        }
      }
    }

    void refreshPrices();
    return () => {
      cancelled = true;
    };
  }, [items, dispatch, calculatePrice, t]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="text-3xl font-semibold">{t("emptyTitle")}</h1>
        <p className="mt-3 text-mebix-graphite/70">{t("emptyText")}</p>
        <Button href="/catalog" className="mt-8">
          {t("viewCatalog")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold md:text-4xl">{t("title")}</h1>
          {syncNote ? <p className="mt-2 text-sm text-mebix-graphite/60">{syncNote}</p> : null}
        </div>
        <Button variant="ghost" onClick={() => dispatch(clearCart())}>
          {t("clear")}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid gap-4 bg-mebix-white p-4 md:grid-cols-[120px_1fr_auto] md:items-center"
          >
            <div className="relative aspect-square overflow-hidden bg-mebix-beige">
              <SafeImage
                src={item.imageUrl}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
            <div>
              <h2 className="text-lg font-medium">
                <Link
                  href={`/catalog/${item.productSlug}?edit=${item.id}`}
                  className="hover:text-mebix-wood"
                >
                  {item.productName}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-mebix-graphite/70">
                {formatDimensions(item.width, item.height, item.depth)}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-mebix-graphite/70">
                <span
                  className="inline-block h-3 w-3 border border-black/10"
                  style={{ backgroundColor: item.colorHex }}
                  aria-hidden
                />
                {item.materialName}, {item.colorName}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-sm" htmlFor={`qty-${item.id}`}>
                  {t("quantity")}
                </label>
                <input
                  id={`qty-${item.id}`}
                  type="number"
                  min={1}
                  max={100}
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: Number(e.target.value) || 1,
                      }),
                    )
                  }
                  className="min-h-10 w-20 border border-mebix-beige px-2"
                />
                <Link
                  href={`/catalog/${item.productSlug}?edit=${item.id}`}
                  className="text-sm text-mebix-wood hover:underline"
                >
                  {t("editConfig")}
                </Link>
                <button
                  type="button"
                  className="cursor-pointer text-sm text-red-700 hover:underline"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  {t("remove")}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-mebix-graphite/60">
                {t("perUnit", { price: formatPrice(item.unitPrice) })}
              </p>
              <p className="mt-1 text-lg font-semibold">{formatPrice(item.lineTotal)}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-mebix-beige bg-mebix-white p-5 sm:flex-row sm:items-center">
        <p className="text-xl font-semibold">{t("total", { price: formatPrice(total) })}</p>
        <Button href="/checkout">{t("checkout")}</Button>
      </div>
    </div>
  );
}
