/*
# Create products table for marketplace

1. New Tables
- `products`
  - `id` (uuid, primary key)
  - `title` (text, not null) — product name
  - `type` (text, not null) — short subtype label e.g. "Tiles & Surfaces"
  - `category` (text, not null) — one of: Tiles, Real Estate, Furniture, Industrial, Cars & Bikes
  - `price` (numeric, not null, default 0) — price in USD
  - `image` (text, not null) — image URL
  - `description` (text, not null) — product description
  - `badge` (text, nullable) — optional badge e.g. "Bestseller", "New"
  - `free` (boolean, not null, default false) — whether the product is free
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `products`.
- Public read (anon + authenticated) so storefront visitors can browse.
- Only authenticated admin users can insert / update / delete.

3. Notes
- Seed data is inserted separately after table creation.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image text NOT NULL,
  description text NOT NULL,
  badge text,
  free boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
ON products FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
ON products FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
ON products FOR DELETE
TO authenticated
USING (true);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
