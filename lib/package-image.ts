function selectFallbackImage(images: string[], title: string, slug: string): string {
  const key = `${title} ${slug}`.toLowerCase()
  const hash = Array.from(key).reduce((value, character) => {
    return (value * 31 + (character.codePointAt(0) ?? 0)) >>> 0
  }, 0)

  return images[hash % images.length]
}

export function getFallbackPackageImage(title = "", slug = ""): string {
  const text = `${title} ${slug}`.toLowerCase()

  if (text.includes("madinah") || text.includes("nabawi") || text.includes("ziyarah")) {
    return selectFallbackImage([
      "/images/masjid-quba.jpg",
      "/images/medina.png",
      "/images/mount-uhud.jpg",
    ], title, slug)
  }
  if (text.includes("umrah") || text.includes("makkah") || text.includes("haram")) {
    return selectFallbackImage([
      "/images/hero-kaaba.jpg",
      "/images/hero-kaaba.png",
      "/images/mecca-skyline.png",
    ], title, slug)
  }
  if (text.includes("hajj")) {
    return selectFallbackImage([
      "/images/kaaba-aerial.png",
      "/images/hero-kaaba.jpg",
      "/images/mecca-skyline.png",
    ], title, slug)
  }

  return selectFallbackImage([
    "/placeholder.jpg",
    "/images/mecca-skyline.png",
    "/images/hero-kaaba.png",
  ], title, slug)
}

export function resolvePackageImage(
  imageUrl?: string | null,
  title = "",
  slug = "",
): string {
  return imageUrl?.trim() || getFallbackPackageImage(title, slug)
}