"use client";

import { useState } from "react";
import { Opinion } from "@/lib/db";
import { getCantonByAbbr } from "@/lib/cantons";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function VoteIcon({ vote }: { vote: string }) {
  if (vote === "zustimmen") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm shrink-0">
        ✓
      </span>
    );
  }
  if (vote === "ablehnen") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold text-sm shrink-0">
        ✗
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-500 font-bold text-sm shrink-0">
      ~
    </span>
  );
}

function OpinionCard({ opinion }: { opinion: Opinion }) {
  const canton = getCantonByAbbr(opinion.canton);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <VoteIcon vote={opinion.vote} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: canton?.color ?? "#666" }}
              >
                {opinion.canton}
              </span>
              {opinion.author_name && (
                <span className="text-sm font-medium text-gray-700">{opinion.author_name}</span>
              )}
            </div>
            <span className="text-xs text-gray-400">{formatDate(opinion.created_at)}</span>
          </div>
          {opinion.text && (
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">{opinion.text}</p>
          )}
          {!opinion.text && (
            <p className="mt-2 text-sm text-gray-400 italic">
              {opinion.vote === "zustimmen" ? "Zustimmung ohne Kommentar" :
               opinion.vote === "ablehnen" ? "Ablehnung ohne Kommentar" : "Neutrale Stimme"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface OpinionsListProps {
  opinions: Opinion[];
}

export default function OpinionsList({ opinions }: OpinionsListProps) {
  const [filter, setFilter] = useState<"alle" | "zustimmen" | "neutral" | "ablehnen">("alle");

  const filtered = filter === "alle" ? opinions : opinions.filter((o) => o.vote === filter);

  const counts = {
    alle: opinions.length,
    zustimmen: opinions.filter((o) => o.vote === "zustimmen").length,
    neutral: opinions.filter((o) => o.vote === "neutral").length,
    ablehnen: opinions.filter((o) => o.vote === "ablehnen").length,
  };

  if (opinions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">Noch keine Meinungen</p>
        <p className="text-sm mt-1">Sei der Erste, der abstimmt!</p>
      </div>
    );
  }

  const filterButtons: { value: typeof filter; label: string; activeClass: string }[] = [
    { value: "alle", label: `Alle (${counts.alle})`, activeClass: "bg-gray-800 text-white" },
    { value: "zustimmen", label: `Zustimmen (${counts.zustimmen})`, activeClass: "bg-emerald-500 text-white" },
    { value: "neutral", label: `Neutral (${counts.neutral})`, activeClass: "bg-gray-500 text-white" },
    { value: "ablehnen", label: `Ablehnen (${counts.ablehnen})`, activeClass: "bg-swiss-red text-white" },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filterButtons.map(({ value, label, activeClass }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              filter === value
                ? `${activeClass} border-transparent`
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Canton distribution (mini) */}
      <div className="mb-5 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stimmen nach Kanton</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(
            opinions.reduce((acc, op) => {
              acc[op.canton] = (acc[op.canton] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([abbr, count]) => {
              const canton = getCantonByAbbr(abbr);
              return (
                <span
                  key={abbr}
                  className="text-xs font-bold px-2 py-0.5 rounded text-white flex items-center gap-1"
                  style={{ backgroundColor: canton?.color ?? "#666" }}
                >
                  {abbr}
                  <span className="bg-white/30 rounded px-1">{count}</span>
                </span>
              );
            })}
        </div>
      </div>

      {/* Opinions */}
      <div className="space-y-3">
        {filtered.map((opinion) => (
          <OpinionCard key={opinion.id} opinion={opinion} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Keine Meinungen für diesen Filter
        </div>
      )}
    </div>
  );
}
