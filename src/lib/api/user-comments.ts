import { API_URL } from "@/lib/api/config";
import { getApiAccessToken } from "@/lib/auth";

export type UserComment = {
  id: string;
  content: string;
  author: string;
  email: string | null;
  createdAt: string | null;
  rating: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function firstString(...values: unknown[]): string | null {
  return values.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  )?.trim() ?? null;
}

function parseRating(value: unknown): number | null {
  const candidate =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : isRecord(value)
          ? Number(value.value ?? value.$numberInt ?? value.$numberDouble)
          : Number.NaN;

  return Number.isInteger(candidate) && candidate >= 1 && candidate <= 5
    ? candidate
    : null;
}

function normalizeComment(value: unknown, index: number): UserComment | null {
  if (!isRecord(value)) {
    return null;
  }

  const content = firstString(value.comment, value.content, value.text);

  if (!content) {
    return null;
  }

  const user = isRecord(value.user)
    ? value.user
    : isRecord(value.reader)
      ? value.reader
      : null;
  const id = firstString(value._id, value.id) ?? `${content}-${index}`;
  const createdAt = firstString(value.createdAt, value.date);
  const rating = parseRating(
    value.rating ??
      value.ratings ??
      value.stars ??
      value.star ??
      value.starRating ??
      value.star_rating ??
      value.ratingValue ??
      value.rating_value ??
      value.rate ??
      value.ratting ??
      value.rateing,
  );

  return {
    id,
    content,
    author:
      firstString(
        value.name,
        value.userName,
        value.authorName,
        value.user_name,
        user?.name,
      ) ?? "Reader",
    email: firstString(value.email, value.userEmail, value.authorEmail, user?.email),
    createdAt,
    rating,
  };
}

function commentsFromPayload(payload: unknown): UserComment[] {
  const records = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.comments)
      ? payload.comments
      : isRecord(payload) && Array.isArray(payload.data)
        ? payload.data
        : null;

  if (!records) {
    throw new Error("The comments API returned an unexpected response.");
  }

  return records
    .map(normalizeComment)
    .filter((comment): comment is UserComment => comment !== null);
}

async function responseMessage(response: Response, fallback: string) {
  const payload: unknown = await response.json().catch(() => null);

  if (isRecord(payload) && typeof payload.message === "string") {
    return payload.message;
  }

  return fallback;
}

export async function getUserComments(userId: string): Promise<UserComment[]> {
  const token = await getApiAccessToken();
  const query = new URLSearchParams({ userId });

  const response = await fetch(`${API_URL}/usersComments?${query}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await responseMessage(
        response,
        `The comments API responded with status ${response.status}.`,
      ),
    );
  }

  return commentsFromPayload(await response.json());
}

export async function postUserComment(
  content: string,
  rating: number,
): Promise<void> {
  const token = await getApiAccessToken();
  const response = await fetch(`${API_URL}/usersComments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      comment: content,
      rating,
      stars: rating,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await responseMessage(
        response,
        `The comments API responded with status ${response.status}.`,
      ),
    );
  }
}
