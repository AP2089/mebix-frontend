"use client";

import { FurnitureConfigurator } from "@/features/configurator/FurnitureConfigurator";
import { selectCartItems } from "@/store/cartSlice";
import { useAppSelector } from "@/store/hooks";
import type { ProductDetail } from "@/types/catalog";

export function ProductConfiguratorClient({
  product,
  editItemId,
}: {
  product: ProductDetail;
  editItemId?: string;
}) {
  const items = useAppSelector(selectCartItems);
  const editItem = editItemId ? items.find((item) => item.id === editItemId) : undefined;

  return (
    <FurnitureConfigurator
      product={product}
      editItemId={editItem?.id}
      initial={
        editItem
          ? {
              width: editItem.width,
              height: editItem.height,
              depth: editItem.depth,
              materialId: editItem.materialId,
              colorId: editItem.colorId,
              quantity: editItem.quantity,
            }
          : undefined
      }
    />
  );
}
