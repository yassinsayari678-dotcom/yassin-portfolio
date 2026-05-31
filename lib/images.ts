import { readdir } from "node:fs/promises";
import path from "node:path";

export type PortfolioImage = {
  id: string;
  name: string;
  src: string;
  alt: string;
};

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp"
]);

async function readImageNames(directory: string) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

export async function getPortfolioImages(): Promise<PortfolioImage[]> {
  const root = process.cwd();
  const rootImages = await readImageNames(root);
  const publicPhotoImages = await readImageNames(path.join(root, "public", "photos"));

  const rootMapped = rootImages.map((name) => ({
    name,
    src: `/media/${encodeURIComponent(name)}`
  }));

  const publicMapped = publicPhotoImages.map((name) => ({
    name,
    src: `/photos/${encodeURIComponent(name)}`
  }));

  const seen = new Set<string>();

  return [...rootMapped, ...publicMapped]
    .filter((image) => {
      const key = image.name.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map((image, index) => ({
      id: `${index}-${image.name}`,
      name: image.name,
      src: image.src,
      alt: `Yassin Sayari campaign portrait ${index + 1}`
    }));
}
