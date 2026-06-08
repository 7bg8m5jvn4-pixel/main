import { NextRequest, NextResponse } from "next/server";
import { getOpinionsByTopicId, createOpinion, getTopicById } from "@/lib/db";
import { CANTON_ABBRS } from "@/lib/cantons";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json({ error: "topicId Parameter fehlt" }, { status: 400 });
    }

    const opinions = await getOpinionsByTopicId(topicId);
    return NextResponse.json(opinions);
  } catch (error) {
    console.error("GET /api/opinions error:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Meinungen" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic_id, vote, text, canton, author_name } = body;

    // Validation
    if (!topic_id || !vote || !canton) {
      return NextResponse.json(
        { error: "Fehlende Pflichtfelder: topic_id, vote, canton" },
        { status: 400 }
      );
    }

    const validVotes = ["zustimmen", "neutral", "ablehnen"];
    if (!validVotes.includes(vote)) {
      return NextResponse.json({ error: "Ungültige Stimme. Erlaubt: zustimmen, neutral, ablehnen" }, { status: 400 });
    }

    if (!CANTON_ABBRS.includes(canton.toUpperCase())) {
      return NextResponse.json({ error: "Ungültiger Kanton" }, { status: 400 });
    }

    // Check topic exists
    const topic = await getTopicById(topic_id);
    if (!topic) {
      return NextResponse.json({ error: "Thema nicht gefunden" }, { status: 404 });
    }

    const opinion = createOpinion({
      id: uuidv4(),
      topic_id,
      vote,
      text: text?.trim() || null,
      canton: canton.toUpperCase(),
      created_at: new Date().toISOString(),
      author_name: author_name?.trim() || null,
    });

    return NextResponse.json(opinion, { status: 201 });
  } catch (error) {
    console.error("POST /api/opinions error:", error);
    return NextResponse.json({ error: "Fehler beim Speichern der Meinung" }, { status: 500 });
  }
}
