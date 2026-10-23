import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { fetchApi } from "@/lib/api";
import type { Category, ProductListResponse } from "@/types/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");

  const [categories, products] = await Promise.all([
    fetchApi<Category[]>("/catalog/categories"),
    fetchApi<ProductListResponse>("/catalog/products?page_size=6&sort=price_desc"),
  ]);

  const benefits = [
    { title: t("whySizesTitle"), text: t("whySizesText") },
    { title: t("whyMaterialsTitle"), text: t("whyMaterialsText") },
    { title: t("whyPriceTitle"), text: t("whyPriceText") },
  ];

  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden">
        <SafeImage
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
          alt={t("heroAlt")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-mebix-graphite/45" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-mebix-graphite">
              <span className="font-display text-xl font-semibold leading-none text-mebix-milk">
                M
              </span>
            </span>
            <p className="font-display text-sm uppercase tracking-[0.25em] text-mebix-milk/80">
              {tBrand("name")}
            </p>
          </div>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-mebix-milk md:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-mebix-milk/85 md:text-lg">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/catalog" className="bg-mebix-wood hover:bg-mebix-wood/90">
              {t("ctaCreate")}
            </Button>
            <Button
              href="/catalog"
              variant="secondary"
              className="border-mebix-milk text-mebix-milk hover:bg-mebix-milk/10"
            >
              {t("ctaCatalog")}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">{t("categoriesTitle")}</h2>
        <p className="mt-2 text-mebix-graphite/70">{t("categoriesSubtitle")}</p>
        {(categories?.length ?? 0) === 0 ? (
          <p className="mt-8 text-sm text-mebix-graphite/70">
            {t("categoriesUnavailable")}{" "}
            <Link href="/catalog" className="text-mebix-wood hover:underline">
              {t("openCatalog")}
            </Link>
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories!.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.slug}`}
                className="group relative aspect-[5/4] overflow-hidden bg-mebix-beige"
              >
                <SafeImage
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-mebix-graphite/75 via-mebix-graphite/20 to-transparent" />
                <span className="absolute bottom-4 left-4 z-20 text-lg font-medium text-mebix-milk">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-mebix-beige/40 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">{t("popularTitle")}</h2>
          <p className="mt-2 text-mebix-graphite/70">{t("popularSubtitle")}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(products?.items ?? []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8">
            <Button href="/catalog" variant="secondary">
              {t("allCatalog")}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">{t("whyTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {benefits.map((item) => (
            <div key={item.title} className="border-t border-mebix-wood/40 pt-4">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-mebix-graphite/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mebix-graphite text-mebix-milk">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center md:px-6">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">{t("howTitle")}</h2>
            <ol className="mt-6 space-y-4 text-mebix-milk/85">
              <li>{t("howStep1")}</li>
              <li>{t("howStep2")}</li>
              <li>{t("howStep3")}</li>
            </ol>
            <Button href="/catalog" className="mt-8 bg-mebix-wood hover:bg-mebix-wood/90">
              {t("openConfigurator")}
            </Button>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <SafeImage
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
              alt={t("productionAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">{t("qualityTitle")}</h2>
        <p className="mt-4 max-w-3xl text-mebix-graphite/75">{t("qualityText")}</p>
      </section>
    </>
  );
}
