import { AppApi } from '@/lib/api/client';
import type { PaginatedResponse } from '@/types/api';
import type { UserDirectoryRecord } from '@/types/user';

export interface ListUsersOptions {
  unitId?: string;
  page: number;
  pageSize: number;
  isManager: boolean;
}

export async function getUsers({
  unitId,
  page,
  pageSize,
  isManager,
}: ListUsersOptions): Promise<PaginatedResponse<UserDirectoryRecord>> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (unitId) query.set('unitId', unitId);
  query.set('isManager', String(isManager));

  const response = await AppApi<PaginatedResponse<UserDirectoryRecord>>(
    `/users?${query.toString()}`,
  );
  return response.data;
}
