import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("contacts");
  return { title: t("metaTitle") };
}

export default async function ContactsPage() {
  const t = await getTranslations("contacts");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="text-3xl font-semibold md:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-mebix-graphite/70">{t("subtitle")}</p>
      <dl className="mt-10 space-y-6">
        <div>
          <dt className="text-xs uppercase tracking-wider text-mebix-graphite/50">{t("email")}</dt>
          <dd className="mt-1">
            <a href={`mailto:${t("emailValue")}`} className="hover:text-mebix-wood">
              {t("emailValue")}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-mebix-graphite/50">{t("phone")}</dt>
          <dd className="mt-1">
            <a href="tel:+74951234567" className="hover:text-mebix-wood">
              {t("phoneValue")}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-mebix-graphite/50">{t("showroom")}</dt>
          <dd className="mt-1">{t("addressValue")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-mebix-graphite/50">{t("hours")}</dt>
          <dd className="mt-1">{t("hoursValue")}</dd>
        </div>
      </dl>
    </div>
  );
}
