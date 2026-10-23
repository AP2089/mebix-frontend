export interface OrderItemPayload {
  product_id: number;
  width: number;
  height: number;
  depth: number;
  material_id: number;
  color_id: number;
  quantity: number;
}

export interface OrderCreatePayload {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  comment?: string;
  items: OrderItemPayload[];
}

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_slug: string;
  product_image_url: string;
  width: number;
  height: number;
  depth: number;
  material_name: string;
  color_name: string;
  color_hex: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  comment: string;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}
