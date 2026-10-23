import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/brand/Logo";

export async function Footer() {
  const t = await getTranslations("brand");
  const tNav = await getTranslations("nav");
  const tContacts = await getTranslations("contacts");

  return (
    <footer className="mt-auto border-t border-mebix-beige bg-mebix-beige/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <Logo markClassName="h-8 w-8" wordmarkClassName="text-xl" />
          <p className="mt-3 text-sm text-mebix-graphite/70">{t("slogan")}</p>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-mebix-graphite/60">
            {tNav("navigation")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/catalog" className="hover:text-mebix-wood">
                {tNav("catalog")}
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-mebix-wood">
                {tNav("contacts")}
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-mebix-wood">
                {tNav("cart")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-mebix-graphite/60">
            {tNav("contacts")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-mebix-graphite/80">
            <li>
              <a href={`mailto:${tContacts("emailValue")}`} className="hover:text-mebix-wood">
                {tContacts("emailValue")}
              </a>
            </li>
            <li>
              <a href="tel:+74951234567" className="hover:text-mebix-wood">
                {tContacts("phoneValue")}
              </a>
            </li>
            <li>{tContacts("addressValue")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mebix-beige/80 px-4 py-4 text-center text-xs text-mebix-graphite/50">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
