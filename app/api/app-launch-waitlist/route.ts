import { NextResponse } from "next/server"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL
    ? `${process.env.NEXT_PUBLIC_API_GATEWAY_URL.replace(/\/$/, "")}/api`
    : process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:8080/api"
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/intelligence/app-launch-waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  })

  if (!response.ok) {
    return NextResponse.json({ message: "We could not add you right now. Please try again." }, { status: response.status })
  }

  return NextResponse.json({ subscribed: true })
}