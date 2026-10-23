import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-3 text-mebix-graphite/70">{t("text")}</p>
      <Button href="/catalog" className="mt-8">
        {t("toCatalog")}
      </Button>
    </div>
  );
}
