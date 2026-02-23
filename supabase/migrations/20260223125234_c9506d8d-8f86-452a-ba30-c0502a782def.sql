
-- Add content_url column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS content_url text DEFAULT '';

-- Create storage bucket for course media
INSERT INTO storage.buckets (id, name, public) VALUES ('course-media', 'course-media', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view course media files
CREATE POLICY "Anyone can view course media"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (bucket_id = 'course-media');

-- Admins can upload course media
CREATE POLICY "Admins can upload course media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update course media
CREATE POLICY "Admins can update course media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete course media
CREATE POLICY "Admins can delete course media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'));
