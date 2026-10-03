'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/api-error';
import { getUsers } from '@/services/authorization/users/users.service';

export function useUsers(isManager: boolean, enabled = true, unitId?: string) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const query = useQuery({
    queryKey: ['users', unitId ?? null, isManager, page, pageSize],
    queryFn: () => getUsers({ unitId, isManager, page, pageSize }),
    enabled,
  });

  useEffect(() => {
    if (query.error instanceof ApiError && query.error.status === 401) {
      router.replace('/login');
    }
  }, [query.error, router]);

  return { ...query, page, pageSize, setPage, setPageSize };
}
