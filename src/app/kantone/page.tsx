import Link from "next/link";
import { CANTONS } from "@/lib/cantons";
import { getTopicsWithStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function KantonePage() {
  const topics = getTopicsWithStats();

  // Count opinions per canton from topics
  const cantonStats: Record<string, { topics: number; opinions: number }> = {};
  for (const canton of CANTONS) {
    cantonStats[canton.abbr] = { topics: 0, opinions: 0 };
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Alle Schweizer Kantone</h1>
        <p className="text-gray-500">
          Erkunde Themen und Meinungen aus allen 26 Kantonen der Schweiz.
        </p>
      </div>

      {/* Canton grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
        {CANTONS.map((canton) => (
          <Link
            key={canton.abbr}
            href={`/?kanton=${canton.abbr}`}
            className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: canton.color }}
            >
              {canton.abbr}
            </div>
            <span className="text-xs text-center text-gray-600 font-medium leading-tight">
              {canton.name}
            </span>
            {canton.primary && (
              <span className="mt-1 text-xs text-swiss-red font-semibold">★ Hauptkanton</span>
            )}
          </Link>
        ))}
      </div>

      {/* Featured: Zürich */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: "#1a6ec8" }}
          >
            ZH
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Zürich</h2>
            <p className="text-sm text-gray-500">Meistdiskutierter Kanton auf Stimme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.filter((t) => t.author_canton === "ZH").map((topic) => (
            <Link
              key={topic.id}
              href={`/themen/${topic.id}`}
              className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{topic.title}</p>
              <p className="text-xs text-gray-500">{topic.total_opinions} Meinungen</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Other active topics by canton */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Alle Themen nach Kanton</h2>
        <div className="space-y-3">
          {topics.map((topic) => {
            const canton = CANTONS.find((c) => c.abbr === topic.author_canton);
            return (
              <Link
                key={topic.id}
                href={`/themen/${topic.id}`}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: canton?.color ?? "#666" }}
                >
                  {topic.author_canton}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 group-hover:text-swiss-red transition-colors">
                    {topic.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {canton?.name} · {topic.category} · {topic.total_opinions} Meinungen
                  </p>
                </div>
                <span className="text-xs text-swiss-red font-semibold shrink-0">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
