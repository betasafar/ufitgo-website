const API_BASE_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api/operator"

export async function fetchPublicPackages(page = 1, limit = 10, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}/packages/public?page=${page}&limit=${limit}`, {
    next: { revalidate: 3600 },
    ...options,
  })
  if (!response.ok) {
    throw new Error('Failed to fetch packages')
  }
  return response.json()
}

export async function fetchPackageComparison(id: string) {
  const response = await fetch(`${API_BASE_URL}/packages/${id}/comparison`)
  if (!response.ok) {
    throw new Error('Failed to fetch package comparison')
  }
  return response.json()
}
