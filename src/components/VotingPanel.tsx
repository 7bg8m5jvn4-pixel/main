"use client";

import { useState } from "react";
import { CANTONS } from "@/lib/cantons";

interface VoteStats {
  zustimmen_count: number;
  neutral_count: number;
  ablehnen_count: number;
  total_opinions: number;
}

interface VotingPanelProps {
  topicId: string;
  initialStats: VoteStats;
}

type VoteType = "zustimmen" | "neutral" | "ablehnen";

function ResultBar({ stats }: { stats: VoteStats }) {
  const total = stats.total_opinions;
  if (total === 0) return null;

  const zPct = Math.round((stats.zustimmen_count / total) * 100);
  const nPct = Math.round((stats.neutral_count / total) * 100);
  const aPct = Math.round((stats.ablehnen_count / total) * 100);

  return (
    <div className="space-y-3 mt-6">
      {/* Zustimmen */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-emerald-600 w-24 shrink-0">Zustimmen</span>
        <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${zPct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-700 w-16 text-right">
          {zPct}% <span className="text-gray-400 font-normal text-xs">({stats.zustimmen_count})</span>
        </span>
      </div>

      {/* Neutral */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-500 w-24 shrink-0">Neutral</span>
        <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-400 rounded-full transition-all duration-700"
            style={{ width: `${nPct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-700 w-16 text-right">
          {nPct}% <span className="text-gray-400 font-normal text-xs">({stats.neutral_count})</span>
        </span>
      </div>

      {/* Ablehnen */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-red-600 w-24 shrink-0">Ablehnen</span>
        <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-swiss-red rounded-full transition-all duration-700"
            style={{ width: `${aPct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-700 w-16 text-right">
          {aPct}% <span className="text-gray-400 font-normal text-xs">({stats.ablehnen_count})</span>
        </span>
      </div>

      <p className="text-xs text-gray-400 text-right pt-1">
        {total} {total === 1 ? "Stimme" : "Stimmen"} abgegeben
      </p>
    </div>
  );
}

export default function VotingPanel({ topicId, initialStats }: VotingPanelProps) {
  const [stats, setStats] = useState<VoteStats>(initialStats);
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [canton, setCanton] = useState("ZH");
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!selectedVote) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/opinions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: topicId,
          vote: selectedVote,
          text: text.trim() || null,
          canton,
          author_name: authorName.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Fehler beim Absenden.");
        return;
      }

      // Update stats locally
      setStats((prev) => ({
        zustimmen_count: prev.zustimmen_count + (selectedVote === "zustimmen" ? 1 : 0),
        neutral_count: prev.neutral_count + (selectedVote === "neutral" ? 1 : 0),
        ablehnen_count: prev.ablehnen_count + (selectedVote === "ablehnen" ? 1 : 0),
        total_opinions: prev.total_opinions + 1,
      }));

      setHasVoted(true);
      setSuccessMessage("Danke für deine Stimme!");
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const voteButtons: { type: VoteType; label: string; icon: string; activeClass: string; borderClass: string }[] = [
    {
      type: "zustimmen",
      label: "Zustimmen",
      icon: "✓",
      activeClass: "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100",
      borderClass: "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400",
    },
    {
      type: "neutral",
      label: "Neutral",
      icon: "~",
      activeClass: "bg-gray-500 text-white border-gray-500 shadow-lg shadow-gray-100",
      borderClass: "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-400",
    },
    {
      type: "ablehnen",
      label: "Ablehnen",
      icon: "✗",
      activeClass: "bg-swiss-red text-white border-swiss-red shadow-lg shadow-red-100",
      borderClass: "border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Deine Stimme</h2>

      {!hasVoted ? (
        <>
          {/* Vote buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {voteButtons.map(({ type, label, icon, activeClass, borderClass }) => (
              <button
                key={type}
                onClick={() => setSelectedVote(type)}
                className={`flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-xl border-2 font-semibold text-sm transition-all duration-150 ${
                  selectedVote === type ? activeClass : `bg-white ${borderClass}`
                }`}
              >
                <span className="text-2xl font-bold">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Opinion form - shows after selecting a vote */}
          {selectedVote && (
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Dein Kanton <span className="text-swiss-red">*</span>
                </label>
                <select
                  value={canton}
                  onChange={(e) => setCanton(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-swiss-red focus:border-swiss-red"
                >
                  {CANTONS.map((c) => (
                    <option key={c.abbr} value={c.abbr}>
                      {c.abbr} – {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Dein Kommentar <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Teile deine Gedanken mit..."
                  rows={3}
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-swiss-red focus:border-swiss-red resize-none"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{text.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Dein Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="z.B. M. Müller"
                  maxLength={50}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-swiss-red focus:border-swiss-red"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-swiss-red hover:bg-swiss-red-dark text-white font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Wird gesendet..." : "Stimme abgeben"}
              </button>
            </div>
          )}

          {/* Preview of current results */}
          {stats.total_opinions > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Bisherige Ergebnisse ({stats.total_opinions} Stimmen)
              </p>
              <ResultBar stats={stats} />
            </div>
          )}
        </>
      ) : (
        <div>
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg px-4 py-3 mb-5 font-medium">
              ✓ {successMessage}
            </div>
          )}
          <p className="text-sm text-gray-600 mb-5">
            Deine Stimme:{" "}
            <span className={`font-bold ${selectedVote === "zustimmen" ? "text-emerald-600" : selectedVote === "ablehnen" ? "text-swiss-red" : "text-gray-600"}`}>
              {selectedVote === "zustimmen" ? "Zustimmen ✓" : selectedVote === "ablehnen" ? "Ablehnen ✗" : "Neutral ~"}
            </span>
            {" "}aus{" "}
            <span className="font-semibold">{canton}</span>
          </p>
          <ResultBar stats={stats} />
        </div>
      )}
    </div>
  );
}
