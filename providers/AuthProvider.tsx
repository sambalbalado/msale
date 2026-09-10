import { Session } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CURRENT_USER } from '@/data/mock';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { AuthCredentials, Profile } from '@/types/domain';

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    displayName: String(row.display_name ?? 'msale member'),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    bio: row.bio ? String(row.bio) : undefined,
    state: String(row.state ?? 'Malaysia'),
    joinedAt: String(row.joined_at ?? new Date().toISOString()),
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    responseRate: Number(row.response_rate ?? 0),
    verified: Boolean(row.verified),
    languages: Array.isArray(row.languages) ? row.languages as Profile['languages'] : ['en'],
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(isSupabaseConfigured ? null : CURRENT_USER);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (data) setProfile(mapProfile(data));
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setProfile(null);
      if (nextSession) void loadProfile(nextSession.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async ({ email, password }: AuthCredentials) => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async ({ email, password }: AuthCredentials) => {
    if (!supabase) return true;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return !data.session;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    configured: isSupabaseConfigured,
    loading,
    session,
    profile,
    isAuthenticated: !isSupabaseConfigured || Boolean(session),
    signIn,
    signUp,
    signOut,
  }), [loading, profile, session, signIn, signOut, signUp]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}

