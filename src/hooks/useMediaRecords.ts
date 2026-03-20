import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaRecord } from '@/types';

export const useMediaRecords = (userId: string | undefined) => {
  const [records, setRecords] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('media_records')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) { console.error('Failed to load media records:', error); return; }

        if (data) {
          setRecords(data.map(r => ({
            id: r.id,
            mediaType: (r.media_type as 'photo' | 'video') || 'photo',
            timestamp: new Date(r.date + 'T12:00:00').toISOString(),
            date: r.date,
            url: r.file_url || '',
            thumbnailUrl: r.thumbnail_url || r.file_url || '',
            tags: r.tags || [],
            notes: r.notes || undefined,
            duration: r.duration || undefined,
            relatedData: {
              dayNumber: r.day_number || undefined,
              weight: r.weight ? Number(r.weight) : undefined,
            },
          })));
        }
      } catch (err) {
        console.error('Media records error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const uploadFile = useCallback(async (file: File, userId: string): Promise<string | null> => {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('user-media')
      .upload(path, file, { upsert: false });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data } = supabase.storage.from('user-media').getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const addRecord = useCallback(async (
    file: File,
    mediaType: 'photo' | 'video',
    date: string,
    notes?: string,
  ): Promise<MediaRecord | null> => {
    if (!userId) return null;

    const fileUrl = await uploadFile(file, userId);
    if (!fileUrl) return null;

    const { data, error } = await supabase
      .from('media_records')
      .insert({
        user_id: userId,
        media_type: mediaType,
        date,
        file_url: fileUrl,
        thumbnail_url: fileUrl,
        tags: [mediaType === 'photo' ? '打卡照片' : '打卡视频'],
        notes: notes || null,
        day_number: 1,
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Insert media record error:', error);
      return null;
    }

    const newRecord: MediaRecord = {
      id: data.id,
      mediaType,
      timestamp: new Date(date + 'T12:00:00').toISOString(),
      date,
      url: fileUrl,
      thumbnailUrl: fileUrl,
      tags: [mediaType === 'photo' ? '打卡照片' : '打卡视频'],
      notes: notes || undefined,
      relatedData: { dayNumber: 1 },
    };

    setRecords(prev => [newRecord, ...prev].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));

    return newRecord;
  }, [userId, uploadFile]);

  const deleteRecord = useCallback(async (id: string, fileUrl?: string): Promise<boolean> => {
    if (!userId) return false;

    // Delete from DB
    const { error } = await supabase
      .from('media_records')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete media record error:', error);
      return false;
    }

    // Try to delete file from storage
    if (fileUrl) {
      try {
        const url = new URL(fileUrl);
        const pathMatch = url.pathname.match(/\/object\/public\/user-media\/(.+)/);
        if (pathMatch) {
          await supabase.storage.from('user-media').remove([pathMatch[1]]);
        }
      } catch { /* ignore storage cleanup errors */ }
    }

    setRecords(prev => prev.filter(r => r.id !== id));
    return true;
  }, [userId]);

  return { records, loading, addRecord, deleteRecord };
};
