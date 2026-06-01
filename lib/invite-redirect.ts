export function resolveInviteRedirectBase(
  siteUrl: string | undefined | null,
  origin: string | undefined | null,
  host: string | undefined | null,
  forwardedProto: string | undefined | null,
): string | null {
  const configuredSiteUrl = siteUrl?.trim()
  if (configuredSiteUrl) {
    return configuredSiteUrl
  }

  const originUrl = origin?.trim()
  if (originUrl) {
    return originUrl
  }

  const normalizedHost = host?.trim()
  if (!normalizedHost) {
    return null
  }

  const isLocalHost =
    normalizedHost.startsWith("localhost") ||
    normalizedHost.startsWith("127.") ||
    normalizedHost === "::1"
  const protocol = forwardedProto?.trim() || (isLocalHost ? "http" : "https")

  return `${protocol}://${normalizedHost}`
}

export function buildInviteRedirectTo(base: string | null | undefined): string | undefined {
  if (!base) return undefined
  return `${base.replace(/\/$/, "")}/auth/callback`
}
