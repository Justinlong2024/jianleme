
-- Create daily_checkins table
CREATE TABLE public.daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  meals jsonb DEFAULT '{}'::jsonb,
  water_records jsonb DEFAULT '[]'::jsonb,
  meditation_records jsonb DEFAULT '[]'::jsonb,
  total_water integer DEFAULT 0,
  total_calories integer DEFAULT 0,
  fasting_hours integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Users can view own check-ins
CREATE POLICY "Users can view own checkins"
ON public.daily_checkins FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert own check-ins
CREATE POLICY "Users can insert own checkins"
ON public.daily_checkins FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update own check-ins
CREATE POLICY "Users can update own checkins"
ON public.daily_checkins FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
