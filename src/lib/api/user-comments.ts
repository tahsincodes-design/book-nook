import { API_URL } from "@/lib/api/config";
import { getApiAccessToken } from "@/lib/auth";

export type UserComment = {
  id: string;
  content: string;
  author: string;
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

function parseDate(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value.trim() : date.toISOString();
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (isRecord(value) && "$date" in value) {
    return parseDate(value.$date);
  }

  return null;
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
  const id =
    firstString(value._id, value.id, value.commentId) ?? `${content}-${index}`;
  const createdAt = parseDate(
    value.createdAt ?? value.created_at ?? value.date ?? value.timestamp,
  );
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
        value.username,
        value.authorName,
        value.user_name,
        value.displayName,
        user?.name,
      ) ?? "Reader",
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
        : isRecord(payload) &&
            isRecord(payload.data) &&
            Array.isArray(payload.data.comments)
          ? payload.data.comments
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

export async function getUserComments(): Promise<UserComment[]> {
  const token = await getApiAccessToken();

  const response = await fetch(`${API_URL}/usersComments`, {
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

export async function getPublicUserComments(): Promise<UserComment[]> {
  const response = await fetch(`${API_URL}/usersComments`, {
    headers: {
      Accept: "application/json",
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
