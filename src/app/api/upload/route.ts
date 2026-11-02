import { NextResponse } from "next/server";

import { MAX_COVER_BYTES } from "@/lib/constants/books";

const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ImgbbResponse = {
  data?: {
    display_url?: string;
    url?: string;
  };
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  const apiKey =
    process.env.IMGBB_API_KEY ?? process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        message:
          "Image upload is not configured. Add IMGBB_API_KEY to .env and restart the dev server, or paste a cover URL instead.",
      },
      { status: 503 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "The upload could not be read. Try again." },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Choose an image file to upload." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Use a JPG, PNG, WEBP, or GIF image." },
      { status: 400 },
    );
  }

  if (file.size > MAX_COVER_BYTES) {
    return NextResponse.json(
      { message: "The cover must be 5MB or smaller." },
      { status: 400 },
    );
  }

  const body = new FormData();
  body.append("image", file, file.name);

  try {
    const response = await fetch(`${IMGBB_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      body,
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as
      | ImgbbResponse
      | null;
    const url = payload?.data?.display_url ?? payload?.data?.url;

    if (!response.ok || typeof url !== "string") {
      return NextResponse.json(
        {
          message:
            payload?.error?.message ??
            "The image host rejected the upload. Try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the image host. Try again." },
      { status: 502 },
    );
  }
}
