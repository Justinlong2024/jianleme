import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CourseDB {
  id: string;
  title: string;
  category: string;
  type: string;
  duration: string;
  thumbnail: string | null;
  instructor: string;
  description: string | null;
  is_free: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export const useCourses = (search?: string, category?: string) => {
  return useQuery({
    queryKey: ['courses', search, category],
    queryFn: async () => {
      let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,instructor.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as CourseDB[];
    },
  });
};

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (course: Omit<CourseDB, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('courses').insert(course).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CourseDB> & { id: string }) => {
      const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};
