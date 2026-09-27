import { BadRequestException } from '@nestjs/common';
import slugify from 'slugify';
import type { PaginatedResponse, PaginationMeta } from '../types/pagination.js';

const DEFAULT_PAGE_SIZE = 15;

export const pagination = (
  size = DEFAULT_PAGE_SIZE,
  page = 1,
  total: number,
): PaginationMeta => {
  const parsedSize = Number.parseInt(String(size), 10);
  const pageSize =
    Number.isFinite(parsedSize) && parsedSize > 0
      ? parsedSize
      : DEFAULT_PAGE_SIZE;
  const safeTotal = Number.isFinite(total) ? Math.max(0, Math.trunc(total)) : 0;
  const totalPages = Math.ceil(safeTotal / pageSize);
  const parsedPage = Number.parseInt(String(page), 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const current = Math.min(requestedPage, Math.max(1, totalPages));
  const skip = (current - 1) * pageSize;
  const nextPage = current < totalPages ? current + 1 : null;

  return { total: safeTotal, current, pageSize, skip, nextPage };
};

export function paginatedResponse<T>(
  items: readonly T[],
  metadata: PaginationMeta,
): PaginatedResponse<T> {
  return { items: [...items], pagination: metadata };
}

export const validateIdParam = (id: number) => {
  const Id = +id;
  if (Number.isNaN(Id)) {
    throw new BadRequestException('Id is not valid !');
  }
  return Id;
};
export const stripHtml = (html: string) => {
  return html.replace(/(<([^>]+)>)/gi, '');
};

export const createSlug = (text: string) => {
  text = text.replace('+', 'plus');
  return slugify(text, {
    lower: true, // Convert to lowercase
    remove: /[*+~.()'"!:@]/g, // Remove special characters (adjust as needed)
    strict: true, // Remove non-alphanumeric characters
    locale: 'en', // Handle special characters in various languages
  });
};
