import { UPLOADS_URL } from "@/config/apiConfig";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const buildUploadsUrl = (relativePath: string) => {
  const normalizedPath = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  return `${UPLOADS_URL}${normalizedPath}`;
};

/**
 * Converts a profile image path returned by the API into an absolute URL that
 * React Native <Image /> can render. Handles values like:
 *   - http(s) URLs (returned as-is)
 *   - /uploads/...
 *   - uploads/...
 *   - profiles/filename.jpg
 *   - filename.jpg (assumes lives in uploads/profiles)
 */
export const resolveProfileImageUrl = (
  rawValue?: string | null
): string | null => {
  if (!rawValue) {
    return null;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  if (ABSOLUTE_URL_REGEX.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  let normalized = trimmed.replace(/\\/g, "/");

  const uploadsIndex = normalized.toLowerCase().indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    const relative = normalized.substring(uploadsIndex + "/uploads".length);
    return buildUploadsUrl(
      relative.startsWith("/") ? relative : `/${relative}`
    );
  }

  if (normalized.startsWith("/uploads")) {
    const relative = normalized.replace(/^\/uploads/, "");
    return buildUploadsUrl(relative);
  }

  if (normalized.startsWith("uploads/")) {
    const relative = normalized.replace(/^uploads/, "");
    return buildUploadsUrl(relative);
  }

  if (normalized.startsWith("/")) {
    return buildUploadsUrl(normalized);
  }

  if (normalized.startsWith("profiles/")) {
    return buildUploadsUrl(`/${normalized}`);
  }

  return buildUploadsUrl(`/profiles/${normalized}`);
};

/**
 * Convenience helper to build a usable avatar URL with graceful fallback.
 */
export const getProfileImageWithFallback = (
  imageUrl: string | null | undefined,
  fallbackName?: string
): string | null => {
  const resolvedUrl = resolveProfileImageUrl(imageUrl || undefined);

  if (resolvedUrl) {
    return resolvedUrl;
  }

  if (fallbackName) {
    const encoded = encodeURIComponent(fallbackName);
    return `https://ui-avatars.com/api/?name=${encoded}&background=37b9a8&color=fff&size=128`;
  }

  return null;
};

