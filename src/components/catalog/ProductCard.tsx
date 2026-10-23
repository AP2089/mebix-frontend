"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("catalog");
  const image = product.image_urls[0];

  return (
    <article className="group flex h-full flex-col bg-mebix-white">
      <Link href={`/catalog/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <SafeImage
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wider text-mebix-graphite/50">
          {product.category.name}
        </p>
        <h3 className="text-lg font-medium">
          <Link href={`/catalog/${product.slug}`} className="hover:text-mebix-wood">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-mebix-graphite/70">{product.description}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-base font-medium">
            {t("priceFromLabel", { price: formatPrice(product.base_price) })}
          </p>
          <Link
            href={`/catalog/${product.slug}`}
            className="text-sm text-mebix-wood hover:underline"
          >
            {t("configure")}
          </Link>
        </div>
      </div>
    </article>
  );
}
