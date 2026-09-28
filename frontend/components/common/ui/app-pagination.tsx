'use client';

import { useId } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { cn } from '@/lib/cn';
import type { PaginationMeta } from '@/types/api';
import { AppButton } from './app-button';
import { AppSelect } from './app-select';

type PageItem = number | 'ellipsis';

const numberFormat = new Intl.NumberFormat('fa-IR');

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages]);
  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page += 1
  ) {
    pages.add(page);
  }

  const sortedPages = [...pages].sort((left, right) => left - right);
  const items: PageItem[] = [];

  sortedPages.forEach((page, index) => {
    if (index > 0) {
      const gap = page - sortedPages[index - 1];
      if (gap === 2) items.push(page - 1);
      if (gap > 2) items.push('ellipsis');
    }
    items.push(page);
  });

  return items;
}

export interface AppPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  disabled?: boolean;
  className?: string;
}

/** Controlled pagination for server-paginated lists; page numbers are 1-based. */
export function AppPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  disabled = false,
  className,
}: AppPaginationProps) {
  const pageSizeSelectId = useId();
  const safePageSize = Math.max(1, pagination.pageSize);
  const safeTotalItems = Math.max(0, pagination.total);
  const safeSkip = Math.max(0, pagination.skip);
  const totalPages = Math.ceil(safeTotalItems / safePageSize);
  const activePage = totalPages
    ? Math.min(Math.max(1, pagination.current), totalPages)
    : 1;
  const firstItem = safeTotalItems ? safeSkip + 1 : 0;
  const lastItem = Math.min(safeSkip + safePageSize, safeTotalItems);
  const pageItems = getPageItems(activePage, totalPages);
  const canGoPrevious = activePage > 1;
  const canGoNext = pagination.nextPage !== null;

  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-3',
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        نمایش {numberFormat.format(firstItem)} تا{' '}
        {numberFormat.format(lastItem)} از {numberFormat.format(safeTotalItems)}
      </p>
      <div className="flex min-w-0 flex-wrap items-center gap-4">
        {onPageSizeChange && (
          <label
            htmlFor={pageSizeSelectId}
            className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground"
          >
            ردیف در صفحه
            <span className="relative inline-flex">
              <AppSelect
                id={pageSizeSelectId}
                options={[...new Set([...pageSizeOptions, safePageSize])]
                  .filter((size) => Number.isFinite(size) && size > 0)
                  .sort((left, right) => left - right)
                  .map((size) => ({
                    label: numberFormat.format(size),
                    value: String(size),
                  }))}
                value={String(safePageSize)}
                disabled={disabled}
                className="w-auto appearance-none ps-10"
                onChange={(event) => {
                  const nextSize = Number(event.target.value);
                  onPageSizeChange(nextSize);
                  onPageChange(1);
                }}
              />
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </span>
          </label>
        )}
        <nav aria-label="صفحه‌بندی" className="flex min-w-0 items-center gap-1">
          <AppButton
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled || !canGoPrevious}
            className="px-0"
            onClick={() => onPageChange(1)}
          >
            <ChevronsRight className="size-4" aria-hidden="true" />
          </AppButton>
          <AppButton
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled || !canGoPrevious}
            className="px-0"
            onClick={() => onPageChange(activePage - 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </AppButton>
          {pageItems.map((item, index) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="inline-flex min-h-11 min-w-7 items-center justify-center text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <AppButton
                key={item}
                type="button"
                size="sm"
                variant={item === activePage ? 'primary' : 'secondary'}
                disabled={disabled}
                className="px-0"
                onClick={() => onPageChange(item)}
              >
                {numberFormat.format(item)}
              </AppButton>
            ),
          )}
          <AppButton
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled || !canGoNext}
            className="px-0"
            onClick={() => {
              if (pagination.nextPage !== null) {
                onPageChange(pagination.nextPage);
              }
            }}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </AppButton>
          <AppButton
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled || !canGoNext}
            className="px-0"
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsLeft className="size-4" aria-hidden="true" />
          </AppButton>
        </nav>
      </div>
    </div>
  );
}
