import { supabase } from '@/services/supabase_service';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

// Define the response shape for our auth calls.
export interface AuthResponse {
  user: User | null;
  session: Session | null;
}

// A generic interface for returning auth results.
export interface AuthResult<T> {
  data: T | null;
  error: Error | null;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult<AuthResponse>> {
  console.log('[AuthService] signIn called with email:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // Log error as a normal log.
      console.log('[AuthService] signIn error:', error);
      return { data: null, error: error as Error };
    }
    console.log('[AuthService] signIn success, data:', data);
    return { data, error: null };
  } catch (err: unknown) {
    console.log('[AuthService] signIn encountered an exception:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

export async function signUp(
  email: string,
  password: string,
): Promise<AuthResult<AuthResponse>> {
  console.log('[AuthService] signUp called with email:', email);
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log('[AuthService] signUp error:', error);
      return { data: null, error: error as Error };
    }
    console.log('[AuthService] signUp success, data:', data);
    return { data, error: null };
  } catch (err: unknown) {
    console.log('[AuthService] signUp encountered an exception:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

export async function getSession(): Promise<{
  session: Session | null;
  error: Error | null;
}> {
  console.log('[AuthService] getSession called');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('[AuthService] getSession error:', error);
      return { session: null, error: error as Error };
    }
    console.log('[AuthService] getSession success, session:', data.session);
    return { session: data.session, error: null };
  } catch (err: unknown) {
    console.log('[AuthService] getSession encountered an exception:', err);
    return {
      session: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

export async function signOut(): Promise<{
  success: boolean;
  error: Error | null;
}> {
  console.log('[AuthService] signOut called');
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('[AuthService] signOut error:', error);
      return { success: false, error: error as Error };
    }
    console.log('[AuthService] signOut success');
    return { success: true, error: null };
  } catch (err: unknown) {
    console.log('[AuthService] signOut encountered an exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  console.log(
    '[AuthService] onAuthStateChange called, subscribing to auth state changes',
  );
  const { data: subscription } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log(
        '[AuthService] onAuthStateChange event:',
        event,
        'session:',
        session,
      );
      callback(event, session);
    },
  );
  return subscription;
}
