-- Tobest Couture Store - Complete Supabase Database Schema
-- Run this full script inside your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb,
  stock INT DEFAULT 10,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on products" ON public.products;
CREATE POLICY "Allow public full access on products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  image TEXT,
  description TEXT,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on categories" ON public.categories;
CREATE POLICY "Allow public full access on categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on orders" ON public.orders;
CREATE POLICY "Allow public full access on orders" ON public.orders FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public full access on contact_messages" ON public.contact_messages FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT,
  customer_name TEXT NOT NULL,
  rating NUMERIC DEFAULT 5,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on reviews" ON public.reviews;
CREATE POLICY "Allow public full access on reviews" ON public.reviews FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  store_name TEXT,
  currency TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  whatsapp_number TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on site_settings" ON public.site_settings;
CREATE POLICY "Allow public full access on site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- 7. DEFAULT SETTINGS SEED
INSERT INTO public.site_settings (id, store_name, currency, phone, email, address, whatsapp_number)
VALUES ('1', 'Tobest Couture', '₦', '+234 812 345 6789', 'contact@tobestcouture.com', '12 Luxury Fashion Avenue, Victoria Island, Lagos, Nigeria', '2348123456789')
ON CONFLICT (id) DO NOTHING;
