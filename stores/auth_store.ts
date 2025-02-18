import { create } from 'zustand';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import {
  getSession,
  onAuthStateChange,
  signOut,
} from '@/services/supabase_auth_service';

interface AuthState {
  session: Session | null;
  sessionFetched: boolean;
  setSession: (session: Session | null) => void;
  setSessionFetched: (flag: boolean) => void;
  fetchSession: () => Promise<void>;
  subscribe: () => () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  sessionFetched: false,
  setSession: (session: Session | null) => {
    console.log('AuthStore: setting session:', session);
    set({ session });
  },
  setSessionFetched: (flag: boolean) => {
    console.log('AuthStore: setting sessionFetched to:', flag);
    set({ sessionFetched: flag });
  },
  fetchSession: async () => {
    const { session, error } = await getSession();
    if (error) {
      console.error('AuthStore: error fetching session:', error);
      set({ session: null, sessionFetched: true });
      return;
    }
    console.log('AuthStore: fetched session:', session);
    set({ session, sessionFetched: true });
  },
  subscribe: () => {
    const subscription = onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log(
          'AuthStore: onAuthStateChange event:',
          event,
          'session:',
          session,
        );
        set({ session });
      },
    );
    return () => subscription?.subscription.unsubscribe();
  },
  signOut: async () => {
    await signOut();
    console.log('AuthStore: signed out');
    set({ session: null, sessionFetched: false });
  },
}));
