export interface CartItem {
  id: string;
  productId: number;
  productSlug: string;
  productName: string;
  imageUrl: string;
  width: number;
  height: number;
  depth: number;
  materialId: number;
  materialName: string;
  colorId: number;
  colorName: string;
  colorHex: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}
