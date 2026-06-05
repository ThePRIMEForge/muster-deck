import { useEffect, useState } from 'react';
import type { FoundationViewer } from './foundationTypes';
import { getOrCreateProfile, hasSupabaseConfig, signOut, supabase } from './supabase';
import type { ProfileRow } from './supabase';

export const guestViewer: FoundationViewer = {
  id: '',
  displayName: 'Guest',
  accountState: 'guest',
  operationRole: 'crew',
  isSiteAdmin: false,
};

function profileToViewer(profile: ProfileRow): FoundationViewer {
  let accountState: FoundationViewer['accountState'] = 'email_account';
  if (profile.account_status === 'banned') accountState = 'banned';
  else if (profile.account_status === 'restricted') accountState = 'restricted';
  else if (profile.rsi_verification_status === 'verified') accountState = 'rsi_verified';
  else if (profile.rsi_verification_status === 'pending') accountState = 'rsi_submitted';

  return {
    id: profile.id,
    displayName: profile.display_name,
    accountState,
    operationRole: 'crew',
    isSiteAdmin: false,
  };
}

export function useAuth() {
  const [viewer, setViewer] = useState<FoundationViewer | null>(null);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        const profile = await getOrCreateProfile();
        if (!cancelled && profile) setViewer(profileToViewer(profile));
      }
      if (!cancelled) setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setViewer(null);
        return;
      }
      if (session?.user) {
        const profile = await getOrCreateProfile();
        if (profile) setViewer(profileToViewer(profile));
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { viewer, isLoading, signOut };
}
