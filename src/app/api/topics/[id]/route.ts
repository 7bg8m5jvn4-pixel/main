import { NextRequest, NextResponse } from "next/server";
import { getTopicById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = getTopicById(params.id);
    if (!topic) {
      return NextResponse.json({ error: "Thema nicht gefunden" }, { status: 404 });
    }
    return NextResponse.json(topic);
  } catch (error) {
    console.error("GET /api/topics/[id] error:", error);
    return NextResponse.json({ error: "Fehler beim Laden des Themas" }, { status: 500 });
  }
}
