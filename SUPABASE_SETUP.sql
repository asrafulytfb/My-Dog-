-- HopeVoice NGO Blog - Supabase SQL Schema

-- 1. Create Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Contact Messages Table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. Policies for blog_posts
-- Allow anyone to read blog posts
CREATE POLICY "Allow public read access" ON blog_posts
  FOR SELECT USING (true);

-- Allow only authenticated users (admins) to insert/update/delete
CREATE POLICY "Allow admin full access" ON blog_posts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Policies for contact_messages
-- Allow anyone to insert messages (from contact form)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- 6. Admin Role Support
-- To promote a user to admin, run this in the SQL Editor:
-- UPDATE auth.users SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"') WHERE email = 'your-admin-email@example.com';

-- Update RLS policies to strictly check for admin role
DROP POLICY "Allow admin full access" ON blog_posts;
CREATE POLICY "Allow admin full access" ON blog_posts
  FOR ALL TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Allow admin read access" ON contact_messages
  FOR SELECT TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
