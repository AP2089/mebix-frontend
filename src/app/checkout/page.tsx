import { getTranslations } from "next-intl/server";

import { CheckoutForm } from "@/features/checkout/CheckoutForm";

export async function generateMetadata() {
  const t = await getTranslations("checkout");
  return { title: t("metaTitle") };
}

export default function CheckoutPage() {
  return <CheckoutForm />;
}
