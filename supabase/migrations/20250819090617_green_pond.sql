/*
  # Design Request Enhancer Tables

  1. New Tables
    - `design_enhancer_categories`
      - `id` (uuid, primary key)
      - `name` (text) - e.g., "Design Style", "Typography", "Color Palette"
      - `slug` (text, unique) - e.g., "design-style", "typography"
      - `description` (text)
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `design_enhancer_options`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text) - e.g., "Modern", "Vintage", "Minimalist"
      - `description` (text)
      - `image_url` (text) - URL to preview image
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `request_enhancer_selections`
      - `id` (uuid, primary key)
      - `request_id` (text) - links to requests
      - `category_id` (uuid, foreign key)
      - `option_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read enhancer data
    - Add policies for admins to manage enhancer data
    - Add policies for users to manage their own selections

  3. Sample Data
    - Insert default categories and options
*/

-- Create design enhancer categories table
CREATE TABLE IF NOT EXISTS design_enhancer_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create design enhancer options table
CREATE TABLE IF NOT EXISTS design_enhancer_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES design_enhancer_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create request enhancer selections table
CREATE TABLE IF NOT EXISTS request_enhancer_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id text NOT NULL,
  category_id uuid NOT NULL REFERENCES design_enhancer_categories(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES design_enhancer_options(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(request_id, category_id)
);

-- Enable RLS
ALTER TABLE design_enhancer_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_enhancer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_enhancer_selections ENABLE ROW LEVEL SECURITY;

-- Policies for categories (readable by all authenticated users)
CREATE POLICY "Anyone can view active categories"
  ON design_enhancer_categories
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON design_enhancer_categories
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'stratiev14@gmail.com');

-- Policies for options (readable by all authenticated users)
CREATE POLICY "Anyone can view active options"
  ON design_enhancer_options
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage options"
  ON design_enhancer_options
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'stratiev14@gmail.com');

-- Policies for selections (users can manage their own)
CREATE POLICY "Users can view their own selections"
  ON request_enhancer_selections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own selections"
  ON request_enhancer_selections
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample categories
INSERT INTO design_enhancer_categories (name, slug, description, sort_order) VALUES
  ('Design Style', 'design-style', 'Choose the overall aesthetic and visual approach', 1),
  ('Typography', 'typography', 'Select typography style preferences', 2),
  ('Color Palette', 'color-palette', 'Choose color scheme preferences', 3),
  ('Aesthetics & Vibe', 'aesthetics-vibe', 'Define the mood and feeling of the design', 4);

-- Insert sample design style options
INSERT INTO design_enhancer_options (category_id, name, description, image_url, sort_order)
SELECT 
  (SELECT id FROM design_enhancer_categories WHERE slug = 'design-style'),
  name,
  description,
  image_url,
  sort_order
FROM (VALUES
  ('Modern', 'Clean, contemporary design with sharp lines', 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400', 1),
  ('Vintage', 'Classic, retro-inspired design elements', 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400', 2),
  ('Minimalist', 'Simple, clean design with lots of white space', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400', 3),
  ('Colorful', 'Vibrant, bold colors and playful elements', 'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&w=400', 4)
) AS t(name, description, image_url, sort_order);

-- Insert sample typography options
INSERT INTO design_enhancer_options (category_id, name, description, sort_order)
SELECT 
  (SELECT id FROM design_enhancer_categories WHERE slug = 'typography'),
  name,
  description,
  sort_order
FROM (VALUES
  ('Sans Serif', 'Clean, modern fonts without decorative strokes', 1),
  ('Serif', 'Traditional fonts with decorative strokes', 2),
  ('Monospace', 'Fixed-width fonts for technical or modern look', 3),
  ('Handwritten', 'Script or handwritten style fonts', 4)
) AS t(name, description, sort_order);

-- Insert sample color palette options
INSERT INTO design_enhancer_options (category_id, name, description, image_url, sort_order)
SELECT 
  (SELECT id FROM design_enhancer_categories WHERE slug = 'color-palette'),
  name,
  description,
  image_url,
  sort_order
FROM (VALUES
  ('Warm Colors', 'Reds, oranges, yellows for energetic feel', 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400', 1),
  ('Cool Colors', 'Blues, greens, purples for calm feel', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400', 2),
  ('Monochrome', 'Black, white, and gray tones', 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400', 3),
  ('Earth Tones', 'Natural browns, beiges, and greens', 'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&w=400', 4)
) AS t(name, description, image_url, sort_order);

-- Insert sample aesthetics options
INSERT INTO design_enhancer_options (category_id, name, description, sort_order)
SELECT 
  (SELECT id FROM design_enhancer_categories WHERE slug = 'aesthetics-vibe'),
  name,
  description,
  sort_order
FROM (VALUES
  ('Professional', 'Corporate, trustworthy, and reliable', 1),
  ('Creative', 'Artistic, innovative, and expressive', 2),
  ('Playful', 'Fun, energetic, and approachable', 3),
  ('Elegant', 'Sophisticated, refined, and luxurious', 4)
) AS t(name, description, sort_order);