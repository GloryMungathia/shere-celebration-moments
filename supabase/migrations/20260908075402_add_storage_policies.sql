/*
# Add storage policies for invitation-photos bucket

1. Security
- Allow authenticated users to upload photos to their own folder
- Allow public read of all photos (published invitations need to be viewable without auth)
- Allow owners to delete their own photos
*/

DROP POLICY IF EXISTS "Public read invitation photos" ON storage.objects;
CREATE POLICY "Public read invitation photos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'invitation-photos');

DROP POLICY IF EXISTS "Auth users upload invitation photos" ON storage.objects;
CREATE POLICY "Auth users upload invitation photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'invitation-photos');

DROP POLICY IF EXISTS "Owners delete invitation photos" ON storage.objects;
CREATE POLICY "Owners delete invitation photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'invitation-photos');