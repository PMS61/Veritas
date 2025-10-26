import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const file = path.join(process.cwd(), "data", "mock-data.json")
    const raw = fs.readFileSync(file, "utf8")
    const json = JSON.parse(raw)
    return NextResponse.json(json)
  } catch (err) {
    console.error("/api/mock error", err)
    return NextResponse.json({ error: "failed to read mock data" }, { status: 500 })
  }
}
