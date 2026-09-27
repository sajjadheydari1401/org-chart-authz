import { BadRequestException } from '@nestjs/common';
import slugify from 'slugify';

export const pagination = (size = 15, page = 1, total: number) => {
  const pageSize = parseInt(String(size), 10);
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.max(
    1,
    Math.min(parseInt(String(page), 10), totalPages),
  );
  const skip = (currentPage - 1) * pageSize;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return { total, current: currentPage, pageSize, skip, nextPage };
};

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
