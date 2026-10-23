"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { selectCartCount } from "@/store/cartSlice";
import { useAppSelector } from "@/store/hooks";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const cartCount = useAppSelector(selectCartCount);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/catalog", label: t("catalog") },
    { href: "/contacts", label: t("contacts") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-mebix-beige/80 bg-mebix-milk/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label={t("mainAria")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide ${
                pathname.startsWith(link.href)
                  ? "text-mebix-wood"
                  : "text-mebix-graphite/80 hover:text-mebix-graphite"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="relative text-sm tracking-wide text-mebix-graphite/80 hover:text-mebix-graphite"
          >
            {t("cart")}
            {cartCount > 0 ? (
              <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded bg-mebix-wood px-1.5 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-mebix-beige md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t("openMenu")}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{t("menu")}</span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-mebix-graphite" />
            <span className="block h-0.5 w-5 bg-mebix-graphite" />
            <span className="block h-0.5 w-5 bg-mebix-graphite" />
          </span>
        </button>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-mebix-beige px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label={t("mobileAria")}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-base"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/cart" className="py-2 text-base" onClick={() => setOpen(false)}>
              {cartCount > 0 ? t("cartWithCount", { count: cartCount }) : t("cart")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
