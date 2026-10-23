import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { OrderSuccessClient } from "@/features/checkout/OrderSuccessClient";

export async function generateMetadata() {
  const t = await getTranslations("orderSuccess");
  return { title: t("metaTitle") };
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("orderSuccess");
  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isFinite(orderId) || orderId <= 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="text-3xl font-semibold">{t("notFound")}</h1>
        <Button href="/catalog" className="mt-8">
          {t("toCatalog")}
        </Button>
      </div>
    );
  }

  return <OrderSuccessClient orderId={orderId} />;
}
