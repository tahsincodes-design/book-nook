import { getPublicUserComments } from "@/lib/api/user-comments";
import { getCurrentUser } from "@/lib/auth";
import { ReadersCornerClient } from "@/components/home/readers-corner-client";

export async function ReadersCorner() {
  const user = await getCurrentUser();

  let comments: Awaited<ReturnType<typeof getPublicUserComments>> = [];
  let loadError: string | null = null;

  try {
    comments = await getPublicUserComments();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load comments.";
  }

  return (
    <ReadersCornerClient
      comments={comments}
      loadError={loadError}
      user={user ? { name: user.name } : null}
    />
  );
}
