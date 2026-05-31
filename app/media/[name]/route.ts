import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const IMAGE_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

type RouteContext = {
  params: Promise<{ name: string }>;
};

async function findImagePath(fileName: string) {
  const safeName = path.basename(fileName);

  if (safeName !== fileName) {
    return null;
  }

  const extension = path.extname(safeName).toLowerCase();

  if (!IMAGE_TYPES[extension]) {
    return null;
  }

  const candidates = [
    path.join(process.cwd(), safeName),
    path.join(process.cwd(), "public", "photos", safeName)
  ];

  for (const candidate of candidates) {
    try {
      const details = await stat(candidate);

      if (details.isFile()) {
        return {
          filePath: candidate,
          contentType: IMAGE_TYPES[extension]
        };
      }
    } catch {
      // Try the next allowed image location.
    }
  }

  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const fileName = decodeURIComponent(params.name);
  const match = await findImagePath(fileName);

  if (!match) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const file = await readFile(match.filePath);

  return new Response(file, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": match.contentType
    }
  });
}
