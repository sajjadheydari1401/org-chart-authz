export interface PaginationMeta {
  total: number;
  current: number;
  pageSize: number;
  skip: number;
  nextPage: number | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
