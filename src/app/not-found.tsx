import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-swiss-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl text-swiss-red font-bold">?</span>
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Seite nicht gefunden</h1>
      <p className="text-gray-500 mb-8">
        Diese Seite existiert nicht oder wurde entfernt.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors"
      >
        ← Zurück zur Übersicht
      </Link>
    </div>
  );
}
