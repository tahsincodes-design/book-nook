export const bookCategories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export type BookCategoryOption = (typeof bookCategories)[number];

export const MAX_COVER_BYTES = 5 * 1024 * 1024;
export const MAX_DESCRIPTION_LENGTH = 600;
export const MAX_COPIES = 99;
