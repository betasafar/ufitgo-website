const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080"

const supportContactUrl = `${API_GATEWAY_URL}/api/operator/settings/public/SUPPORT_WHATSAPP_NUMBER`

export type SupportContact = {
  displayNumber: string
  phoneHref: string
  whatsappUrl: string
}

function normalizePhoneNumber(value: unknown): SupportContact | null {
  if (typeof value !== "string") return null

  const displayNumber = value.trim()
  const digits = displayNumber.replace(/\D/g, "")
  if (!displayNumber || !digits) return null

  return {
    displayNumber,
    phoneHref: `tel:${displayNumber}`,
    whatsappUrl: `https://wa.me/${digits}`,
  }
}

export async function getSupportContact(): Promise<SupportContact | null> {
  try {
    const response = await fetch(supportContactUrl, { cache: "no-store" })
    if (!response.ok) return null

    const payload = await response.json()
    return normalizePhoneNumber(payload?.value)
  } catch {
    return null
  }
}

export function supportWhatsappUrl(contact: SupportContact, message: string) {
  return `${contact.whatsappUrl}?text=${encodeURIComponent(message)}`
}
