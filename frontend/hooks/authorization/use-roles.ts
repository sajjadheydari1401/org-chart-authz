'use client';

import { useQuery } from '@tanstack/react-query';
import { getRoles } from '@/services/authorization/roles/roles.service';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
}
