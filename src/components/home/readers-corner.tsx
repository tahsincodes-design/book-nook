import { getUserComments } from "@/lib/api/user-comments";
import { getCurrentUser } from "@/lib/auth";
import { ReadersCornerClient } from "@/components/home/readers-corner-client";

export async function ReadersCorner() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <ReadersCornerClient
        comments={[]}
        loadError={null}
        user={null}
      />
    );
  }

  let comments: Awaited<ReturnType<typeof getUserComments>> = [];
  let loadError: string | null = null;

  try {
    comments = await getUserComments();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load comments.";
  }

  return (
    <ReadersCornerClient
      comments={comments}
      loadError={loadError}
      user={{ name: user.name }}
    />
  );
}
