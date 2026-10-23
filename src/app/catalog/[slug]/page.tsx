import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProductConfiguratorClient } from "@/features/configurator/ProductConfiguratorClient";
import { fetchApi } from "@/lib/api";
import type { ProductDetail } from "@/types/catalog";

export const dynamic = "force-dynamic";

async function getProduct(slug: string): Promise<ProductDetail | null> {
  return fetchApi<ProductDetail>(`/catalog/products/${slug}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("product");
  const { slug } = await params;
  const product = await getProduct(slug);
  return {
    title: product?.name ?? t("metaFallback"),
    description: product?.description,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <ProductConfiguratorClient product={product} editItemId={edit} />
    </div>
  );
}
