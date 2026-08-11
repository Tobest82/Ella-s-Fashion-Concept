export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount_price?: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  product_count: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  notes?: string;
  total_amount: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  items: OrderItem[];
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  business_name: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  address: string;
  announcement_bar_text: string;
  currency_symbol: string;
  hero_title: string;
  hero_subtitle: string;
  hero_banner_url: string;
  instagram_handle: string;
}
