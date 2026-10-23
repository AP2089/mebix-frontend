import { getTranslations } from "next-intl/server";

import { CartView } from "@/features/cart/CartView";

export async function generateMetadata() {
  const t = await getTranslations("cart");
  return { title: t("metaTitle") };
}

export default function CartPage() {
  return <CartView />;
}
