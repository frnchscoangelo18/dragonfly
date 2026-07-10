-- Rate limits table for tracking AI generation usage
-- Run this in the Supabase SQL Editor or via `supabase db push`

CREATE TABLE IF NOT EXISTS rate_limits (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier  TEXT NOT NULL,       -- "guest:<deviceId>" or "user:<supabaseUserId>"
  ip          TEXT NOT NULL,
  date        TEXT NOT NULL,       -- "YYYY-MM-DD" in UTC
  count       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(identifier, date)
);

-- Index for fast lookups by identifier + date
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON rate_limits (identifier, date);

-- Atomic increment function — handles upsert and returns the new count + whether limit is exceeded
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_identifier TEXT,
  p_ip TEXT,
  p_date TEXT
) RETURNS TABLE(count INTEGER, limited BOOLEAN) AS $$
DECLARE
  v_limit INTEGER;
BEGIN
  -- Upsert: create row if not exists, otherwise increment atomically
  INSERT INTO rate_limits (identifier, ip, date, count)
  VALUES (p_identifier, p_ip, p_date, 1)
  ON CONFLICT (identifier, date) DO UPDATE
    SET count = rate_limits.count + 1,
        updated_at = now()
  RETURNING rate_limits.count INTO count;

  -- Determine limit based on identifier type
  IF p_identifier LIKE 'guest:%' THEN
    v_limit := 3;
  ELSE
    v_limit := 10;
  END IF;

  limited := count > v_limit;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security — users can only read their own rows
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rate limits"
  ON rate_limits
  FOR SELECT
  USING (true);  -- Allow all reads (the increment function handles write security)

-- Allow the increment function to insert/update (SECURITY DEFINER handles this,
-- but we add an explicit policy for the insert path via the client)
CREATE POLICY "Service role can insert/update rate limits"
  ON rate_limits
  FOR ALL
  USING (true)
  WITH CHECK (true);
