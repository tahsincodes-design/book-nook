export const demoUser = {
  name: "Tahsin Ahmed",
  email: "tahsin@booknook.demo",
  initials: "TA",
  role: "Library member · Demo",
  borrowedCount: 0,
  bio: "A quiet corner, a warm cup of tea, and a stack of books that keeps growing. I share the stories that stay with me.",
  location: "Dhaka, Bangladesh",
  favoriteCategory: "Fiction",
  joinedAt: "2025-03-12",
};

export type DemoUser = typeof demoUser;

export function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BN"
  );
}
