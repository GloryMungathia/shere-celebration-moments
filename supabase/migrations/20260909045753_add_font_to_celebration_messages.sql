/*
# Add font column to celebration_messages

1. Changes
- Add `font` column (text, nullable) to the `celebration_messages` table.
- This stores the user-selected font for each celebration message (e.g. "'Dancing Script', cursive").
2. Security
- No policy changes needed. The existing owner-scoped CRUD policies already cover the new column.
3. Notes
- The column is nullable so existing messages without a font selection are not affected.
- New messages will save the selected font value from the editor.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'celebration_messages' AND column_name = 'font'
  ) THEN
    ALTER TABLE celebration_messages ADD COLUMN font text;
  END IF;
END $$;
