import Link from "next/link";
import { getTopicsWithStats, Topic } from "@/lib/db";
import { getCantonByAbbr } from "@/lib/cantons";

const CATEGORY_COLORS: Record<string, string> = {
  Politik: "bg-blue-100 text-blue-800",
  Gesellschaft: "bg-purple-100 text-purple-800",
  Verkehr: "bg-orange-100 text-orange-800",
  Umwelt: "bg-green-100 text-green-800",
  Wirtschaft: "bg-yellow-100 text-yellow-800",
  Bildung: "bg-teal-100 text-teal-800",
};

function VoteBar({ zustimmen, neutral, ablehnen, total }: {
  zustimmen: number;
  neutral: number;
  ablehnen: number;
  total: number;
}) {
  if (total === 0) {
    return (
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full w-full bg-gray-300" />
      </div>
    );
  }
  const zPct = (zustimmen / total) * 100;
  const nPct = (neutral / total) * 100;
  const aPct = (ablehnen / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
        {zPct > 0 && (
          <div className="bg-emerald-500 transition-all" style={{ width: `${zPct}%` }} />
        )}
        {nPct > 0 && (
          <div className="bg-gray-400 transition-all" style={{ width: `${nPct}%` }} />
        )}
        {aPct > 0 && (
          <div className="bg-swiss-red transition-all" style={{ width: `${aPct}%` }} />
        )}
      </div>
      <div className="flex text-xs text-gray-500 justify-between">
        <span className="text-emerald-600 font-medium">{Math.round(zPct)}% Ja</span>
        <span>{Math.round(nPct)}% Neutral</span>
        <span className="text-swiss-red font-medium">{Math.round(aPct)}% Nein</span>
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  const total = topic.total_opinions ?? 0;
  const canton = getCantonByAbbr(topic.author_canton);

  return (
    <Link href={`/themen/${topic.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-swiss-red/30 transition-all duration-200 h-full flex flex-col">
        {/* Category + Canton */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[topic.category] ?? "bg-gray-100 text-gray-700"}`}>
            {topic.category}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: canton?.color ?? "#666" }}
          >
            {topic.author_canton}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-gray-900 group-hover:text-swiss-red transition-colors mb-2 flex-1">
          {topic.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {topic.description}
        </p>

        {/* Vote bar */}
        <VoteBar
          zustimmen={topic.zustimmen_count ?? 0}
          neutral={topic.neutral_count ?? 0}
          ablehnen={topic.ablehnen_count ?? 0}
          total={total}
        />

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {total} {total === 1 ? "Meinung" : "Meinungen"}
          </span>
          <span className="text-xs text-swiss-red font-semibold group-hover:underline">
            Abstimmen →
          </span>
        </div>
      </div>
    </Link>
  );
}

function HeroSection() {
  return (
    <div className="bg-navy text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Swiss cross motif */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-swiss-red rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold leading-none select-none">✛</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          Deine Meinung zählt
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Stimme über aktuelle Fragen aus Zürich und der ganzen Schweiz ab.
          Zeige, was du denkst – transparent, anonym und direkt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="#themen"
            className="px-6 py-3 bg-swiss-red hover:bg-swiss-red-dark text-white font-semibold rounded-lg transition-colors"
          >
            Themen entdecken
          </Link>
          <Link
            href="/neu"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
          >
            Eigene Frage stellen
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatsBar({ topics }: { topics: Topic[] }) {
  const totalOpinions = topics.reduce((sum, t) => sum + (t.total_opinions ?? 0), 0);
  const totalTopics = topics.length;
  const cantons = new Set(topics.flatMap(t => [t.author_canton])).size;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap gap-6 justify-center sm:justify-start text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl font-bold text-swiss-red">{totalTopics}</span>
            <span>aktive Themen</span>
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl font-bold text-swiss-red">{totalOpinions}</span>
            <span>Meinungen eingegangen</span>
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl font-bold text-swiss-red">26</span>
            <span>Schweizer Kantone</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const topics = getTopicsWithStats();

  return (
    <>
      <HeroSection />
      <StatsBar topics={topics} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10" id="themen">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Aktuelle Themen</h2>
            <p className="text-gray-500 text-sm mt-1">Stimme jetzt ab – deine Meinung macht den Unterschied</p>
          </div>
          <Link
            href="/neu"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-swiss-red text-white text-sm font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors"
          >
            + Neue Frage
          </Link>
        </div>

        {/* Trending badge for top topic */}
        {topics.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">🔥 Meistdiskutiert</span>
            </div>
            <TopicCard topic={topics[0]} />
          </div>
        )}

        {/* Grid */}
        {topics.length > 1 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Alle Themen</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topics.slice(1).map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </>
        )}

        {topics.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">Noch keine Themen vorhanden</p>
            <Link href="/neu" className="mt-4 inline-block text-swiss-red underline">
              Erste Frage stellen
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
