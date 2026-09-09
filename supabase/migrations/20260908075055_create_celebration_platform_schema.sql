/*
# Create Celebration & Invitation Platform Schema

1. New Tables
- `invitation_templates` — Pre-built invitation templates with occasion, style, name, and config (colors, fonts, layout)
- `invitations` — User-created invitations linked to a template, with event info, photo, customization, slug, and status
- `message_templates` — Pre-written celebration message templates by category
- `celebration_messages` — User-created celebration messages with recipient, title, body, sender, slug, and status

2. Security
- `invitation_templates`: public read (anon + authenticated), no writes from client
- `message_templates`: public read (anon + authenticated), no writes from client
- `invitations`: owner-scoped CRUD for authenticated users; public read by slug for published invitations
- `celebration_messages`: owner-scoped CRUD for authenticated users; public read by slug for published messages

3. Important Notes
- Owner columns default to `auth.uid()` so inserts without explicit user_id succeed.
- Public SELECT policies on invitations/celebration_messages allow viewing published items by slug without auth.
- Indexes on slug columns for fast public lookups.
*/

-- Invitation templates (seed data, read-only from client)
CREATE TABLE IF NOT EXISTS invitation_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  occasion text NOT NULL,
  style text NOT NULL DEFAULT 'elegant',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invitation_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_invitation_templates" ON invitation_templates;
CREATE POLICY "public_read_invitation_templates" ON invitation_templates FOR SELECT
  TO anon, authenticated USING (true);

-- Message templates (seed data, read-only from client)
CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_message_templates" ON message_templates;
CREATE POLICY "public_read_message_templates" ON message_templates FOR SELECT
  TO anon, authenticated USING (true);

-- Invitations (user-owned, public read by slug)
CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  occasion text NOT NULL,
  template_id uuid REFERENCES invitation_templates(id) ON DELETE SET NULL,
  title text,
  name text,
  event_date date,
  event_time text,
  venue text,
  address text,
  message text,
  photo_url text,
  customization jsonb NOT NULL DEFAULT '{}'::jsonb,
  slug text UNIQUE,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Public read for published invitations (by slug)
DROP POLICY IF EXISTS "public_read_published_invitations" ON invitations;
CREATE POLICY "public_read_published_invitations" ON invitations FOR SELECT
  TO anon, authenticated USING (status = 'published');

-- Owner-scoped CRUD
DROP POLICY IF EXISTS "select_own_invitations" ON invitations;
CREATE POLICY "select_own_invitations" ON invitations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_invitations" ON invitations;
CREATE POLICY "insert_own_invitations" ON invitations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_invitations" ON invitations;
CREATE POLICY "update_own_invitations" ON invitations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_invitations" ON invitations;
CREATE POLICY "delete_own_invitations" ON invitations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);

-- Celebration messages (user-owned, public read by slug)
CREATE TABLE IF NOT EXISTS celebration_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  recipient_name text,
  title text,
  message text,
  sender_name text,
  slug text UNIQUE,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE celebration_messages ENABLE ROW LEVEL SECURITY;

-- Public read for published messages (by slug)
DROP POLICY IF EXISTS "public_read_published_messages" ON celebration_messages;
CREATE POLICY "public_read_published_messages" ON celebration_messages FOR SELECT
  TO anon, authenticated USING (status = 'published');

-- Owner-scoped CRUD
DROP POLICY IF EXISTS "select_own_messages" ON celebration_messages;
CREATE POLICY "select_own_messages" ON celebration_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_messages" ON celebration_messages;
CREATE POLICY "insert_own_messages" ON celebration_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_messages" ON celebration_messages;
CREATE POLICY "update_own_messages" ON celebration_messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_messages" ON celebration_messages;
CREATE POLICY "delete_own_messages" ON celebration_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_celebration_messages_slug ON celebration_messages(slug);
CREATE INDEX IF NOT EXISTS idx_celebration_messages_user_id ON celebration_messages(user_id);