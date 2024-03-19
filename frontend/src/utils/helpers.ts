export const getImageUri = (uri: string): string => {
  if (!uri) return;
  if (uri.startsWith("http") || uri.startsWith("/uploads")) return uri;

  return `/uploads/${uri}`;
};
