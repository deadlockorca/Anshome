const publicIdPattern = /^AN[A-Z0-9]+$/;

export function buildListingDetailPath(listing: { slug: string; publicId: string }): string {
  return `/tin-dang/${listing.slug}-${listing.publicId}`;
}

export function isPublicId(value: string): boolean {
  return publicIdPattern.test(value);
}

export function parseListingSlugId(slugId: string): { slug: string; publicId: string } | null {
  if (isPublicId(slugId)) {
    return { slug: "", publicId: slugId };
  }

  const dashIndex = slugId.lastIndexOf("-");

  if (dashIndex <= 0) {
    return null;
  }

  const slug = slugId.slice(0, dashIndex);
  const publicId = slugId.slice(dashIndex + 1);

  if (!isPublicId(publicId)) {
    return null;
  }

  return { slug, publicId };
}
