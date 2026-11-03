"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";

import {
  addUserComment,
  refreshUserComments,
} from "@/lib/actions/user-comments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { UserComment } from "@/lib/api/user-comments";

type CommentingUser = {
  name: string;
};

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BN"
  );
}

export function ReadersCornerClient({
  comments: initialComments,
  loadError,
  user,
}: {
  comments: UserComment[];
  loadError: string | null;
  user: CommentingUser | null;
}) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [error, setError] = useState(loadError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await addUserComment(content);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setContent("");
      const refreshed = await refreshUserComments();

      if (!refreshed.ok) {
        setError(refreshed.message);
        return;
      }

      setComments(refreshed.comments);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit your comment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-12" aria-labelledby="readers-corner-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="readers-corner-title"
            className="font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-foreground sm:text-[2.1rem]"
          >
            Readers&apos; corner
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {user
              ? `Reader comments for ${user.name}.`
              : "Reader comments from the BookNook community."}
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-0 bg-brand-sage/20 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-brand-forest uppercase dark:bg-brand-sage/10 dark:text-brand-sage"
        >
          Community notes
        </Badge>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {comments.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {comments.map((comment) => (
            <Card
              key={comment.id}
              className="flex h-full flex-col justify-between rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10"
            >
              <blockquote className="font-display text-[1.08rem] leading-snug text-foreground">
                &ldquo;{comment.content}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <Avatar size="sm">
                  <AvatarFallback className="bg-[#e4d8c8] text-[0.62rem] font-semibold text-[#5a4939] dark:bg-[#3a2d25] dark:text-[#e8d6c4]">
                    {initialsFromName(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {comment.author}
                  </p>
                  {comment.createdAt && (
                    <time
                      className="text-[0.7rem] text-muted-foreground"
                      dateTime={comment.createdAt}
                    >
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </time>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        user &&
        !error && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/60 px-5 py-8 text-center">
            <MessageSquare
              className="mx-auto size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              No comments yet. Start the conversation.
            </p>
          </div>
        )
      )}

      {user ? (
        <Card className="mt-5 rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
          <form onSubmit={handleSubmit} className="grid gap-3">
            <label
              htmlFor="reader-comment"
              className="text-sm font-semibold text-foreground"
            >
              Leave a comment on your reader profile
            </label>
            <Textarea
              id="reader-comment"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={1000}
              placeholder="Share a thought with the community"
              required
              aria-describedby="reader-comment-count"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                id="reader-comment-count"
                className="text-xs text-muted-foreground"
              >
                {content.length}/1000
              </span>
              <Button
                type="submit"
                className="rounded-full"
                disabled={isSubmitting || !content.trim()}
              >
                <Send className="size-4" aria-hidden="true" />
                {isSubmitting ? "Posting..." : "Post comment"}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/50 px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Sign in to view and add comments.
          </p>
          <Button
            render={<Link href="/login?redirect=%2F" />}
            nativeButton={false}
            variant="outline"
            className="rounded-full"
          >
            Sign in to comment
          </Button>
        </div>
      )}
    </section>
  );
}
