'use client';

import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const rolesResponseSchema = z.object({
  roles: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().trim().min(1),
    }),
  ),
});

async function fetchRoles() {
  const response = await fetch('/api/roles');
  if (!response.ok) throw new Error('بارگیری نقش‌ها ناموفق بود.');

  const result = rolesResponseSchema.safeParse(await response.json());
  if (!result.success) throw new Error('پاسخ فهرست نقش‌ها معتبر نیست.');

  return result.data.roles;
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 5 * 60 * 1000,
  });
}
