"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { formatDimensions, formatPrice } from "@/lib/format";
import { useGetOrderQuery } from "@/store/api";

export function OrderSuccessClient({ orderId }: { orderId: number }) {
  const t = useTranslations("orderSuccess");
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="text-3xl font-semibold">{t("notFound")}</h1>
        <Button href="/catalog" className="mt-8">
          {t("toCatalog")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-sm uppercase tracking-wider text-mebix-wood">{t("accepted")}</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{t("thanks", { id: order.id })}</h1>
      <p className="mt-3 text-mebix-graphite/70">{t("description")}</p>

      <div className="mt-8 space-y-3 bg-mebix-white p-5">
        <p className="text-sm">
          <span className="text-mebix-graphite/60">{t("customer")}</span> {order.customer_name}
        </p>
        <p className="text-sm">
          <span className="text-mebix-graphite/60">{t("address")}</span> {order.delivery_address}
        </p>
        <p className="text-sm">
          <span className="text-mebix-graphite/60">{t("status")}</span> {order.status}
        </p>
        <ul className="mt-4 space-y-3 border-t border-mebix-beige pt-4">
          {order.items.map((item) => (
            <li key={item.id} className="text-sm">
              <p className="font-medium">
                {item.product_name} × {item.quantity}
              </p>
              <p className="text-mebix-graphite/70">
                {formatDimensions(item.width, item.height, item.depth)} · {item.material_name},{" "}
                {item.color_name}
              </p>
              <p className="mt-1">{formatPrice(item.line_total)}</p>
            </li>
          ))}
        </ul>
        <p className="border-t border-mebix-beige pt-4 text-lg font-semibold">
          {t("total", { price: formatPrice(order.total_amount) })}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/catalog">{t("continue")}</Button>
        <Button href="/" variant="secondary">
          {t("home")}
        </Button>
      </div>
    </div>
  );
}
