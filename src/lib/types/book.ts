export type BookCategory =
  | "Fiction"
  | "Science"
  | "History"
  | "Kids"
  | "Personal Growth"
  | "Others";

export type BookOwner = {
  name: string;
  email: string;
};

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
  addedBy: BookOwner;
  createdAt: string;
};
