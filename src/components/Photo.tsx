import { getPhoto } from "@/lib/photos";

/**
 * A photo from content/photos/. The browser picks the smallest AVIF or WebP version that is
 * still sharp at the width given in `sizes`. Width and height are set, so the page does not
 * jump while the photo loads.
 *
 * `priority` is for the one photo at the top of a page: it loads first instead of waiting
 * until it is near the screen.
 */
export function Photo({
  photo,
  alt,
  sizes,
  priority = false,
  className,
}: {
  photo: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const versions = getPhoto(photo);
  const srcSet = (list: { width: number; src: string }[]) =>
    list.map((s) => `${s.src} ${s.width}w`).join(", ");
  // Browsers that read neither srcset (very old ones) get a medium-sized WebP.
  const fallback = versions.webp.find((s) => s.width >= 800) ?? versions.webp.at(-1)!;

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(versions.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(versions.webp)} sizes={sizes} />
      <img
        src={fallback.src}
        alt={alt}
        width={versions.width}
        height={versions.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
