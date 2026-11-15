import { getPhoto } from "@/lib/photos";

/** Phone screens: at most this wide a version, whatever the screen's pixel density. */
const PHONE = "(max-width: 47.99em)";
const PHONE_MAX_WIDTH = 800;

/**
 * A photo from content/photos/. The browser picks the smallest AVIF or WebP version that is
 * still sharp at the width given in `sizes`. Width and height are set, so the page does not
 * jump while the photo loads.
 *
 * Phones are offered versions up to 800 px only. Most phones have screens two to three times
 * as dense as a laptop's and would otherwise take the 1080 px version of a full-width photo:
 * twice the data, for sharpness the eye cannot see at that size. 800 px is still more than
 * twice the width a phone shows a photo at.
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
  const forPhones = (list: { width: number; src: string }[]) => {
    const fit = list.filter((s) => s.width <= PHONE_MAX_WIDTH);
    return fit.length > 0 ? fit : list.slice(0, 1);
  };
  // Browsers that read neither srcset (very old ones) get a medium-sized WebP.
  const fallback = versions.webp.find((s) => s.width >= 800) ?? versions.webp.at(-1)!;

  return (
    <picture className={className}>
      {/* The browser uses the first source that matches its screen and that it can show. */}
      <source
        media={PHONE}
        type="image/avif"
        srcSet={srcSet(forPhones(versions.avif))}
        sizes={sizes}
      />
      <source
        media={PHONE}
        type="image/webp"
        srcSet={srcSet(forPhones(versions.webp))}
        sizes={sizes}
      />
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
