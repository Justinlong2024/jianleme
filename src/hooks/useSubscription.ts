import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  price_cents: number;
  started_at: string;
  expires_at: string | null;
  payment_method: string | null;
}

export const useSubscription = (userId: string | undefined) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const isPremium = !!subscription
    && subscription.plan === 'premium'
    && subscription.status === 'active'
    && (!subscription.expires_at || new Date(subscription.expires_at) > new Date());

  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        if (!cancelled) setSubscription(data as Subscription | null);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [userId]);

  return { subscription, isPremium, loading };
};
