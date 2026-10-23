export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface Material {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_multiplier: string;
}

export interface ColorOption {
  id: number;
  name: string;
  slug: string;
  hex_code: string;
  price_multiplier: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: string;
  image_urls: string[];
  category: Category;
  is_available: boolean;
  min_width: number;
  max_width: number;
  min_height: number;
  max_height: number;
  min_depth: number;
  max_depth: number;
  materials: Material[];
  colors: ColorOption[];
  base_width?: number;
  base_height?: number;
  base_depth?: number;
  size_step?: number;
}

export interface ProductDetail extends Product {
  base_width: number;
  base_height: number;
  base_depth: number;
  size_step: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface PriceBreakdown {
  base_price: string;
  size_factor: string;
  material_multiplier: string;
  color_multiplier: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface ConfigurationValidation {
  valid: boolean;
  product_id: number;
  product_name: string;
  width: number;
  height: number;
  depth: number;
  material: Material;
  color: ColorOption;
  pricing: PriceBreakdown;
  message: string;
}

export interface ConfigurationPayload {
  product_id: number;
  width: number;
  height: number;
  depth: number;
  material_id: number;
  color_id: number;
  quantity: number;
}
