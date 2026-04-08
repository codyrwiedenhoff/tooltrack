'use client';

import { useAuth } from './useAuth';

export function useRole() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const isUser = user?.role === 'USER';
  const canManage = isAdmin || isManager;

  return { isAdmin, isManager, isUser, canManage, userRole: user?.role };
}
