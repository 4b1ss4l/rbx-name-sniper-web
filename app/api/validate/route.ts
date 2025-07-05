import { type NextRequest, NextResponse } from "next/server"

// /api/validate?username=<name>&birthday=<yyyy-mm-dd>
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")
  const birthday = searchParams.get("birthday")

  if (!username || !birthday) {
    return NextResponse.json({ error: "Missing username or birthday" }, { status: 400 })
  }

  const robloxUrl = `https://auth.roblox.com/v1/usernames/validate?request.username=${username}&request.birthday=${birthday}`

  try {
    const res = await fetch(robloxUrl, {
      // A normal UA header helps avoid some 403 blocks
      headers: { "User-Agent": "Mozilla/5.0 (rbx-name-sniper)" },
      cache: "no-store",
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Upstream error" }, { status: 500 })
  }
}
