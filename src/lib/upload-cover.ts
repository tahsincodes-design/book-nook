import { MAX_COVER_BYTES } from "@/lib/constants/books";

type UploadResponse = {
  url?: string;
  message?: string;
};

export type UploadCoverResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

/**
 * Sends a cover file to the imgbb upload route. The route reads
 * `IMGBB_API_KEY` on the server, so the key never reaches the browser.
 */
export async function uploadCover(file: File): Promise<UploadCoverResult> {
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "Choose a JPG, PNG, WEBP, or GIF image." };
  }

  if (file.size > MAX_COVER_BYTES) {
    return { ok: false, message: "The cover must be 5MB or smaller." };
  }

  const body = new FormData();
  body.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body,
    });
    const payload = (await response.json().catch(() => null)) as
      | UploadResponse
      | null;

    if (!response.ok || !payload?.url) {
      return {
        ok: false,
        message:
          payload?.message ?? "Try again or paste an image URL instead.",
      };
    }

    return { ok: true, url: payload.url };
  } catch {
    return {
      ok: false,
      message: "Could not reach the upload service. Try again.",
    };
  }
}
