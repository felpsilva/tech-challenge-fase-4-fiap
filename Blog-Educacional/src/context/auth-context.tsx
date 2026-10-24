import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { authService } from '@/services/auth-service';
import { ApiError } from '@/lib/api-client';
import { clearSession, getSession, saveSession } from '@/lib/session-storage';
import { AuthSession, Permission } from '@/types/api';

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  signIn(username: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  hasPermission(...permissions: Permission[]): boolean;
  canManageContent: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function hasSessionPermission(
  session: AuthSession | null,
  permissions: Permission[],
) {
  return session !== null && permissions.includes(session.user.permission);
}

function decodeTokenPayload(token: string) {
  const encodedPayload = token.split('.')[1];
  if (!encodedPayload) {
    throw new Error('Invalid authentication token');
  }

  const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(`${base64}${padding}`)) as {
    id: number;
    username: string;
    permission: Permission;
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then(setSession)
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(username: string, password: string) {
    const response = await authService.signIn(username, password);
    const payload = decodeTokenPayload(response.token);
    const nextSession: AuthSession = { token: response.token, user: payload };
    await saveSession(nextSession);
    setSession(nextSession);
  }

  async function signOut() {
    await clearSession();
    setSession(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      signIn,
      signOut,
      hasPermission: (...permissions) => hasSessionPermission(session, permissions),
      canManageContent: hasSessionPermission(session, ['admin', 'professor']),
      canManageUsers: hasSessionPermission(session, ['admin']),
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}
