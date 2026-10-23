import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductCard } from "@/components/catalog/ProductCard";
import { fetchApi } from "@/lib/api";
import type { Category, ColorOption, Material, ProductListResponse } from "@/types/catalog";

export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  category?: string;
  material?: string;
  color?: string;
  min_price?: string;
  max_price?: string;
  min_width?: string;
  max_width?: string;
  sort?: string;
  page?: string;
}

function buildQuery(params: SearchParams): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  if (!query.has("page_size")) query.set("page_size", "12");
  return query.toString();
}

export async function generateMetadata() {
  const t = await getTranslations("catalog");
  return { title: t("metaTitle") };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("catalog");
  const params = await searchParams;
  const query = buildQuery(params);

  const [products, categories, filterSource] = await Promise.all([
    fetchApi<ProductListResponse>(`/catalog/products?${query}`),
    fetchApi<Category[]>("/catalog/categories"),
    fetchApi<ProductListResponse>("/catalog/products?page_size=48"),
  ]);

  const materials: Material[] = [];
  const colors: ColorOption[] = [];
  for (const product of filterSource?.items ?? products?.items ?? []) {
    materials.push(...product.materials);
    colors.push(...product.colors);
  }

  const page = Number(params.page ?? "1");
  const pages = products?.pages ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold md:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-mebix-graphite/70">{t("subtitle")}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Suspense fallback={<div className="bg-mebix-white p-4">{t("filtersLoading")}</div>}>
          <CatalogFilters
            categories={categories ?? []}
            materials={materials}
            colors={colors}
          />
        </Suspense>

        <div>
          <p className="mb-4 text-sm text-mebix-graphite/60">
            {t("found", { count: products?.total ?? 0 })}
          </p>

          {(products?.items.length ?? 0) === 0 ? (
            <div className="bg-mebix-white p-8 text-center">
              <p className="text-lg font-medium">{t("emptyTitle")}</p>
              <p className="mt-2 text-sm text-mebix-graphite/70">{t("emptyText")}</p>
              <Link href="/catalog" className="mt-4 inline-block text-mebix-wood hover:underline">
                {t("resetFilters")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products!.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {pages > 1 ? (
            <nav className="mt-8 flex flex-wrap gap-2" aria-label={t("paginationAria")}>
              {Array.from({ length: pages }, (_, index) => {
                const pageNumber = index + 1;
                const pageParams = new URLSearchParams(query);
                pageParams.set("page", String(pageNumber));
                return (
                  <Link
                    key={pageNumber}
                    href={`/catalog?${pageParams.toString()}`}
                    className={`inline-flex min-h-10 min-w-10 items-center justify-center border px-3 text-sm ${
                      pageNumber === page
                        ? "border-mebix-graphite bg-mebix-graphite text-mebix-milk"
                        : "border-mebix-beige bg-mebix-white hover:border-mebix-wood"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
