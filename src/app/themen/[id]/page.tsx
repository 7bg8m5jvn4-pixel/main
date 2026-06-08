import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicById, getOpinionsByTopicId } from "@/lib/db";
import { getCantonByAbbr } from "@/lib/cantons";
import VotingPanel from "@/components/VotingPanel";
import OpinionsList from "@/components/OpinionsList";

const CATEGORY_COLORS: Record<string, string> = {
  Politik: "bg-blue-100 text-blue-800",
  Gesellschaft: "bg-purple-100 text-purple-800",
  Verkehr: "bg-orange-100 text-orange-800",
  Umwelt: "bg-green-100 text-green-800",
  Wirtschaft: "bg-yellow-100 text-yellow-800",
  Bildung: "bg-teal-100 text-teal-800",
};

const CATEGORY_ICONS: Record<string, string> = {
  Politik: "🏛",
  Gesellschaft: "👥",
  Verkehr: "🚌",
  Umwelt: "🌿",
  Wirtschaft: "📈",
  Bildung: "📚",
};

export const dynamic = "force-dynamic";

export default async function TopicPage({ params }: { params: { id: string } }) {
  const topic = getTopicById(params.id);

  if (!topic) {
    notFound();
  }

  const opinions = getOpinionsByTopicId(params.id);
  const canton = getCantonByAbbr(topic.author_canton);

  const stats = {
    zustimmen_count: topic.zustimmen_count ?? 0,
    neutral_count: topic.neutral_count ?? 0,
    ablehnen_count: topic.ablehnen_count ?? 0,
    total_opinions: topic.total_opinions ?? 0,
  };

  function formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-swiss-red transition-colors">Themen</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{topic.title}</span>
      </nav>

      {/* Topic header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[topic.category] ?? "bg-gray-100 text-gray-700"}`}>
            {CATEGORY_ICONS[topic.category]} {topic.category}
          </span>
          <span
            className="text-sm font-bold px-2.5 py-1 rounded text-white"
            style={{ backgroundColor: canton?.color ?? "#666" }}
          >
            {topic.author_canton} · {canton?.name}
          </span>
          <span className="text-sm text-gray-400 ml-auto">
            {formatDate(topic.created_at)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
          {topic.title}
        </h1>
        <p className="text-gray-600 leading-relaxed text-base">
          {topic.description}
        </p>

        {/* Quick stats */}
        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>
            <strong className="text-gray-800">{stats.total_opinions}</strong>{" "}
            {stats.total_opinions === 1 ? "Meinung" : "Meinungen"}
          </span>
          {stats.total_opinions > 0 && (
            <>
              <span className="text-emerald-600">
                <strong>{stats.zustimmen_count}</strong> Zustimmungen
              </span>
              <span className="text-gray-500">
                <strong>{stats.neutral_count}</strong> Neutral
              </span>
              <span className="text-swiss-red">
                <strong>{stats.ablehnen_count}</strong> Ablehnungen
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Voting + Results */}
        <div className="lg:col-span-1 space-y-4">
          <VotingPanel topicId={topic.id} initialStats={stats} />

          {/* Share / Back card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Weitere Aktionen</h3>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-swiss-red transition-colors py-1"
            >
              ← Alle Themen
            </Link>
            <Link
              href="/neu"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-swiss-red transition-colors py-1"
            >
              + Neue Frage stellen
            </Link>
          </div>
        </div>

        {/* Right: Opinions list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Meinungen aus der Schweiz
            </h2>
            <OpinionsList opinions={opinions} />
          </div>
        </div>
      </div>
    </div>
  );
}
