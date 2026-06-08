import { NextRequest, NextResponse } from "next/server";
import { getTopicsWithStats, createTopic } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const topics = await getTopicsWithStats();
    return NextResponse.json(topics);
  } catch (error) {
    console.error("GET /api/topics error:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Themen" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, author_canton } = body;

    if (!title || !description || !category || !author_canton) {
      return NextResponse.json(
        { error: "Fehlende Pflichtfelder: title, description, category, author_canton" },
        { status: 400 }
      );
    }

    const validCategories = ["Politik", "Gesellschaft", "Verkehr", "Umwelt", "Wirtschaft", "Bildung"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Ungültige Kategorie" }, { status: 400 });
    }

    const topic = await createTopic({
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      category,
      author_canton: author_canton.toUpperCase(),
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("POST /api/topics error:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen des Themas" }, { status: 500 });
  }
}
