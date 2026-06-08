"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CANTONS } from "@/lib/cantons";

const CATEGORIES = ["Politik", "Gesellschaft", "Verkehr", "Umwelt", "Wirtschaft", "Bildung"];

const CATEGORY_ICONS: Record<string, string> = {
  Politik: "🏛",
  Gesellschaft: "👥",
  Verkehr: "🚌",
  Umwelt: "🌿",
  Wirtschaft: "📈",
  Bildung: "📚",
};

export default function NeuePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [authorCanton, setAuthorCanton] = useState("ZH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          author_canton: authorCanton,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Fehler beim Erstellen des Themas.");
        return;
      }

      const topic = await res.json();
      router.push(`/themen/${topic.id}`);
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-swiss-red transition-colors">Themen</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Neue Frage</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Neue Frage stellen</h1>
        <p className="text-gray-500">
          Stelle eine Frage zu einem aktuellen Thema in der Schweiz und sammle Meinungen aus allen Kantonen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Frage / Titel <span className="text-swiss-red">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Soll Zürich mehr Velowege bauen?"
            maxLength={150}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-swiss-red focus:border-swiss-red"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{title.length}/150</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Beschreibung <span className="text-swiss-red">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Erkläre das Thema und warum es wichtig ist..."
            rows={4}
            maxLength={1000}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-swiss-red focus:border-swiss-red resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{description.length}/1000</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Kategorie <span className="text-swiss-red">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-swiss-red text-white border-swiss-red shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Author Canton */}
        <div>
          <label htmlFor="canton" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Dein Kanton <span className="text-swiss-red">*</span>
          </label>
          <select
            id="canton"
            value={authorCanton}
            onChange={(e) => setAuthorCanton(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-swiss-red focus:border-swiss-red"
          >
            {CANTONS.map((c) => (
              <option key={c.abbr} value={c.abbr}>
                {c.abbr} – {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Guidelines box */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
          <p className="font-semibold mb-1">Hinweise zur Fragestellung:</p>
          <ul className="space-y-1 text-xs list-disc list-inside text-blue-600">
            <li>Formuliere die Frage neutral und offen</li>
            <li>Die Frage sollte mit Ja/Nein beantwortbar sein</li>
            <li>Bezieht sich auf die Schweiz oder einen bestimmten Kanton</li>
          </ul>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 text-center py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim() || !category}
            className="flex-1 py-3 bg-swiss-red hover:bg-swiss-red-dark text-white font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? "Wird veröffentlicht..." : "Frage veröffentlichen"}
          </button>
        </div>
      </form>
    </div>
  );
}
