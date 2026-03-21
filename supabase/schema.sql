-- ============================================
-- Insight Tattoo Studio — Database Schema
-- ============================================

-- Artists
CREATE TABLE artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  email TEXT,
  avatar_url TEXT,
  availability TEXT,
  specialties TEXT[],
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images (per artist)
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (shop)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries (contact form submissions)
CREATE TABLE enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  artist_preference TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiry inspiration images
CREATE TABLE enquiry_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Artists: public read, auth required for write
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artists are viewable by everyone" ON artists FOR SELECT USING (true);

-- Gallery: public read
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery images are viewable by everyone" ON gallery_images FOR SELECT USING (true);

-- Products: public read active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active products are viewable by everyone" ON products FOR SELECT USING (active = true);

-- Enquiries: anyone can insert (submit form)
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry" ON enquiries FOR INSERT WITH CHECK (true);

-- Enquiry images: anyone can insert
ALTER TABLE enquiry_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can upload enquiry images" ON enquiry_images FOR INSERT WITH CHECK (true);

-- Testimonials: public read active
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active testimonials are viewable by everyone" ON testimonials FOR SELECT USING (active = true);

-- ============================================
-- Storage Buckets
-- ============================================
-- Run these in the Supabase dashboard under Storage:
-- 1. Create bucket: "gallery" (public)
-- 2. Create bucket: "enquiry-uploads" (public)
-- 3. Create bucket: "avatars" (public)
-- 4. Create bucket: "products" (public)

-- ============================================
-- Seed Data — Artists
-- ============================================
INSERT INTO artists (name, slug, bio, email, availability, specialties, sort_order) VALUES
(
  'Renee',
  'renee',
  'Studio owner and lead artist since 2016. Renee specialises in watercolour work, NZ native birds, floral designs, and contemporary Maori-inspired pieces. Large-scale work in preferred styles receives discounted hourly rates.',
  'info@insighttattoo.co.nz',
  'Books open — appointments available',
  ARRAY['Watercolour', 'NZ Native Birds', 'Floral', 'Contemporary Maori'],
  1
),
(
  'Ash',
  'ash',
  'Ash brings a bold illustrative style to the studio, specialising in geometric designs, hand tattoos, and detailed black work. Walk-ins welcome on Thursdays from 9am.',
  'ashink.tattoos@icloud.com',
  'Wed, Fri, Sat by appointment. Thu walk-ins from 9am.',
  ARRAY['Illustrative', 'Geometric', 'Hand Tattoos', 'Black Work'],
  2
),
(
  'Fae',
  'fae',
  'Fae creates beautiful flash designs and custom pieces with a focus on botanical, geometric, and illustrative styles. Flash designs are regularly posted on the Insight Facebook page.',
  'fwolfepine@gmail.com',
  'Mon, Thu, Sat. Flash and custom designs available.',
  ARRAY['Flash Designs', 'Custom', 'Botanical', 'Geometric'],
  3
);

-- Seed Data — Products
INSERT INTO products (name, description, price, sort_order) VALUES
('Tui Tattoo', 'Beautiful NZ Tui bird design', 400.00, 1),
('Medium Back Piece', 'Medium size back tattoo design', 650.00, 2),
('Wrist Floral', 'Delicate floral wrist piece', 280.00, 3);

-- Seed Data — Testimonials (placeholder — replace with real ones)
INSERT INTO testimonials (name, text, sort_order) VALUES
('Sarah M.', 'Such a welcoming studio. Renee took the time to really understand what I wanted and the result was beyond anything I imagined. Can''t wait to go back!', 1),
('Jade T.', 'Ash did an incredible geometric piece on my forearm. The detail is unreal. The whole experience was so relaxed and professional.', 2),
('Mia R.', 'I was nervous getting my first tattoo but the team at Insight made me feel so comfortable. Fae''s flash designs are beautiful — I ended up getting two!', 3);
