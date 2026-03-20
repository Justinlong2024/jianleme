
CREATE TABLE public.media_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  media_type text NOT NULL DEFAULT 'photo',
  date date NOT NULL,
  file_url text,
  thumbnail_url text,
  tags text[] DEFAULT '{}',
  notes text,
  duration integer,
  day_number integer,
  weight numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.media_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own media" ON public.media_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own media" ON public.media_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own media" ON public.media_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own media" ON public.media_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('user-media', 'user-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own media files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-media');

CREATE POLICY "Users can delete own media files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'user-media' AND (storage.foldername(name))[1] = auth.uid()::text);
