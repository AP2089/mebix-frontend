"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import type { Category, ColorOption, Material } from "@/types/catalog";

interface Props {
  categories: Category[];
  materials: Material[];
  colors: ColorOption[];
}

export function CatalogFilters({ categories, materials, colors }: Props) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [material, setMaterial] = useState(searchParams.get("material") ?? "");
  const [color, setColor] = useState(searchParams.get("color") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") ?? "");
  const [minWidth, setMinWidth] = useState(searchParams.get("min_width") ?? "");
  const [maxWidth, setMaxWidth] = useState(searchParams.get("max_width") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "name_asc");

  const uniqueMaterials = useMemo(() => {
    const map = new Map(materials.map((item) => [item.slug, item]));
    return Array.from(map.values());
  }, [materials]);

  const uniqueColors = useMemo(() => {
    const map = new Map(colors.map((item) => [item.slug, item]));
    return Array.from(map.values());
  }, [colors]);

  function applyFilters(event?: FormEvent) {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (material) params.set("material", material);
    if (color) params.set("color", color);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (minWidth) params.set("min_width", minWidth);
    if (maxWidth) params.set("max_width", maxWidth);
    if (sort) params.set("sort", sort);
    params.set("page", "1");
    router.push(`/catalog?${params.toString()}`);
  }

  function resetFilters() {
    setQ("");
    setCategory("");
    setMaterial("");
    setColor("");
    setMinPrice("");
    setMaxPrice("");
    setMinWidth("");
    setMaxWidth("");
    setSort("name_asc");
    router.push("/catalog");
  }

  return (
    <form
      onSubmit={applyFilters}
      className="space-y-4 bg-mebix-white p-4 md:sticky md:top-24 md:p-5"
      aria-label={t("filtersAria")}
    >
      <div>
        <label htmlFor="q" className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60">
          {t("search")}
        </label>
        <input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
          placeholder={t("searchPlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
        >
          {t("category")}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
        >
          <option value="">{t("all")}</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="material"
          className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
        >
          {t("material")}
        </label>
        <select
          id="material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
        >
          <option value="">{t("all")}</option>
          {uniqueMaterials.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="color"
          className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
        >
          {t("color")}
        </label>
        <select
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
        >
          <option value="">{t("all")}</option>
          {uniqueColors.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="min_price"
            className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
          >
            {t("priceFrom")}
          </label>
          <input
            id="min_price"
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="max_price"
            className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
          >
            {t("priceTo")}
          </label>
          <input
            id="max_price"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="min_width"
            className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
          >
            {t("widthFrom")}
          </label>
          <input
            id="min_width"
            type="number"
            min={0}
            value={minWidth}
            onChange={(e) => setMinWidth(e.target.value)}
            className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="max_width"
            className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
          >
            {t("widthTo")}
          </label>
          <input
            id="max_width"
            type="number"
            min={0}
            value={maxWidth}
            onChange={(e) => setMaxWidth(e.target.value)}
            className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="sort"
          className="mb-1 block text-xs uppercase tracking-wider text-mebix-graphite/60"
        >
          {t("sort")}
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="min-h-11 w-full border border-mebix-beige bg-mebix-milk px-3 text-sm"
        >
          <option value="name_asc">{t("sortNameAsc")}</option>
          <option value="name_desc">{t("sortNameDesc")}</option>
          <option value="price_asc">{t("sortPriceAsc")}</option>
          <option value="price_desc">{t("sortPriceDesc")}</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button type="submit" className="w-full">
          {t("apply")}
        </Button>
        <Button type="button" variant="secondary" className="w-full" onClick={resetFilters}>
          {t("reset")}
        </Button>
      </div>
    </form>
  );
}
