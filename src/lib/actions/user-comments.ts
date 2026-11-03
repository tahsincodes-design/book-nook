"use server";

import { getUserComments, postUserComment } from "@/lib/api/user-comments";
import { getCurrentUser } from "@/lib/auth";

export type AddUserCommentResult =
  | { ok: true }
  | { ok: false; message: string };

export async function addUserComment(
  content: string,
  rating: number,
): Promise<AddUserCommentResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sign in to add a comment." };
  }

  const comment = content.trim();

  if (!comment) {
    return { ok: false, message: "Write a comment before submitting." };
  }

  if (comment.length > 1000) {
    return {
      ok: false,
      message: "Comments must be 1,000 characters or fewer.",
    };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, message: "Choose a rating from 1 to 5 stars." };
  }

  try {
    await postUserComment(user.id, user.name, user.email, comment, rating);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Could not submit your comment.",
    };
  }
}

export async function refreshUserComments() {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false as const, message: "Sign in to view comments." };
  }

  try {
    return {
      ok: true as const,
      comments: await getUserComments(user.id, user.email),
    };
  } catch (error) {
    return {
      ok: false as const,
      message:
        error instanceof Error ? error.message : "Could not load comments.",
    };
  }
}
