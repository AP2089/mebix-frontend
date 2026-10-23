"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { useCreateOrderMutation } from "@/store/api";
import { clearCart, selectCartItems, selectCartTotal } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type FormValues = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  comment?: string;
};

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        customer_name: z.string().trim().min(2, t("errorName")).max(120),
        customer_phone: z.string().trim().min(5, t("errorPhone")).max(40),
        customer_email: z.string().trim().email(t("errorEmail")),
        delivery_address: z.string().trim().min(5, t("errorAddress")).max(1000),
        comment: z.string().max(2000).optional(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      delivery_address: "",
      comment: "",
    },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="text-3xl font-semibold">{t("emptyTitle")}</h1>
        <p className="mt-3 text-mebix-graphite/70">{t("emptyText")}</p>
        <Button href="/catalog" className="mt-8">
          {t("toCatalog")}
        </Button>
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const order = await createOrder({
        ...values,
        comment: values.comment ?? "",
        items: items.map((item) => ({
          product_id: item.productId,
          width: item.width,
          height: item.height,
          depth: item.depth,
          material_id: item.materialId,
          color_id: item.colorId,
          quantity: item.quantity,
        })),
      }).unwrap();

      dispatch(clearCart());
      router.push(`/order-success/${order.id}`);
    } catch (error) {
      const err = error as { data?: { error?: { message?: string } } };
      setServerError(err.data?.error?.message ?? t("errorSubmit"));
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.2fr_0.8fr] md:px-6">
      <div>
        <h1 className="text-3xl font-semibold md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-mebix-graphite/70">{t("subtitle")}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <Field label={t("name")} error={errors.customer_name?.message}>
            <input
              {...register("customer_name")}
              className="min-h-11 w-full border border-mebix-beige bg-mebix-white px-3"
              autoComplete="name"
            />
          </Field>
          <Field label={t("phone")} error={errors.customer_phone?.message}>
            <input
              {...register("customer_phone")}
              className="min-h-11 w-full border border-mebix-beige bg-mebix-white px-3"
              autoComplete="tel"
            />
          </Field>
          <Field label={t("email")} error={errors.customer_email?.message}>
            <input
              type="email"
              {...register("customer_email")}
              className="min-h-11 w-full border border-mebix-beige bg-mebix-white px-3"
              autoComplete="email"
            />
          </Field>
          <Field label={t("address")} error={errors.delivery_address?.message}>
            <textarea
              {...register("delivery_address")}
              rows={3}
              className="w-full border border-mebix-beige bg-mebix-white px-3 py-2"
              autoComplete="street-address"
            />
          </Field>
          <Field label={t("comment")} error={errors.comment?.message}>
            <textarea
              {...register("comment")}
              rows={3}
              className="w-full border border-mebix-beige bg-mebix-white px-3 py-2"
            />
          </Field>

          {serverError ? (
            <p className="text-sm text-red-700" role="alert">
              {serverError}
            </p>
          ) : null}

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? t("submitting") : t("submit")}
          </Button>
        </form>
      </div>

      <aside className="h-fit bg-mebix-white p-5">
        <h2 className="text-lg font-medium">{t("yourOrder")}</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 text-sm">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span className="whitespace-nowrap">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-mebix-beige pt-4 text-lg font-semibold">
          {t("preliminary", { price: formatPrice(total) })}
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
