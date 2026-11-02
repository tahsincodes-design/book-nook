import {
  BookOpen,
  Compass,
  House,
  Library,
  Plus,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Private routes are only shown to signed-in readers. */
  private?: boolean;
  count?: number;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "All Books", href: "/books", icon: Compass },
  { label: "Add Book", href: "/add-book", icon: Plus, private: true },
  {
    label: "My Books",
    href: "/my-books",
    icon: Library,
    private: true,
    count: 2,
  },
  {
    label: "My Borrows",
    href: "/my-borrows",
    icon: BookOpen,
    private: true,
    count: 0,
  },
];
