import { NextResponse } from "next/server";
import { resetDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    resetDatabase();
    return NextResponse.json({
      success: true,
      message: "Datenbank wurde zurückgesetzt und neu befüllt.",
    });
  } catch (error) {
    console.error("GET /api/seed error:", error);
    return NextResponse.json({ error: "Fehler beim Zurücksetzen der Datenbank" }, { status: 500 });
  }
}
