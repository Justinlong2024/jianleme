import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord } from '@/types';

const getLocalDateStr = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const useHealthRecords = (userId: string | undefined) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: true });

        if (error) { console.error('Failed to load health records:', error); return; }

        if (data) {
          setRecords(data.map(r => ({
            id: r.id,
            date: r.date,
            weight: r.weight ? Number(r.weight) : undefined,
            bodyFat: r.body_fat ? Number(r.body_fat) : undefined,
            waistCircumference: (r as any).waist_circumference ? Number((r as any).waist_circumference) : undefined,
            bloodSugar: r.blood_sugar ? Number(r.blood_sugar) : undefined,
            bloodPressureSystolic: r.blood_pressure_systolic ?? undefined,
            bloodPressureDiastolic: r.blood_pressure_diastolic ?? undefined,
          })));
        }
      } catch (err) {
        console.error('Health records error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const addRecord = useCallback(async (record: Omit<HealthRecord, 'id'>) => {
    if (!userId) return;

    const date = record.date || getLocalDateStr();

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const newRecord: HealthRecord = { ...record, id: tempId, date };

    setRecords(prev => {
      const existing = prev.findIndex(r => r.date === date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...record, date };
        return updated;
      }
      return [...prev, newRecord].sort((a, b) => a.date.localeCompare(b.date));
    });

    try {
      const { error } = await supabase
        .from('health_records')
        .upsert({
          user_id: userId,
          date,
          weight: record.weight ?? null,
          body_fat: record.bodyFat ?? null,
          blood_sugar: record.bloodSugar ?? null,
          blood_pressure_systolic: record.bloodPressureSystolic ?? null,
          blood_pressure_diastolic: record.bloodPressureDiastolic ?? null,
        }, { onConflict: 'user_id,date' });

      if (error) {
        console.error('Failed to save health record:', error);
        // Rollback
        setRecords(prev => prev.filter(r => r.id !== tempId));
      }
    } catch (err) {
      console.error('Save health record error:', err);
    }
  }, [userId]);

  return { records, loading, addRecord };
};
