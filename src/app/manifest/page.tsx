import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unser Manifest – Stimme",
  description: "Warum Stimme existiert: Eine offene, unabhängige Meinungsplattform für die Schweiz.",
};

function IconSwiss() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#DC0028" />
      <rect x="17" y="8" width="6" height="24" fill="white" />
      <rect x="8" y="17" width="24" height="6" fill="white" />
    </svg>
  );
}

function IconVoice() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <line x1="12" x2="12" y1="3" y2="21" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  number: string;
  title: string;
  children: React.ReactNode;
}

function ManifestoSection({ icon, number, title, children }: SectionProps) {
  return (
    <div className="relative flex gap-6 md:gap-8">
      {/* Left: number line */}
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-red-50 border-2 border-swiss-red flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 w-px bg-gray-200 mt-3" />
      </div>

      {/* Right: content */}
      <div className="pb-12 flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold text-swiss-red uppercase tracking-widest">{number}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">{title}</h2>
        <div className="text-gray-600 leading-relaxed text-base md:text-lg">{children}</div>
      </div>
    </div>
  );
}

export default function ManifestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-swiss-red transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-swiss-red transform translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="flex justify-center mb-8">
            <IconSwiss />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-4">
            Unser Manifest
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 text-center font-light max-w-2xl mx-auto">
            Warum Stimme existiert
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-24 bg-swiss-red rounded-full" />
          </div>
        </div>
      </div>

      {/* Intro quote */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <blockquote className="text-xl md:text-2xl font-medium text-navy leading-relaxed italic">
            &ldquo;Eine Demokratie lebt von echten Meinungen — nicht von Algorithmen.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <ManifestoSection icon={<IconVoice />} number="01" title="Was ist Stimme?">
          <p>
            Eine offene, unabhängige Meinungsplattform für die Schweiz. Hier können Bürgerinnen und
            Bürger zu wichtigen Themen Stellung nehmen — von Zürich bis in alle 26 Kantone. Wir
            sammeln echte Meinungen, nicht Klicks.
          </p>
        </ManifestoSection>

        <ManifestoSection icon={<IconScale />} number="02" title="Warum braucht es Stimme?">
          <p>
            Die öffentliche Debatte findet heute oft in Algorithmen-gesteuerten Social-Media-Blasen
            statt. Stimme bietet einen anderen Weg: strukturiert, anonym, kantonsbewusst. Jede
            Meinung zählt gleich viel — egal ob aus dem Kanton Zürich oder Appenzell Innerrhoden.
          </p>
        </ManifestoSection>

        <ManifestoSection icon={<IconCheckCircle />} number="03" title="Wie funktioniert es?">
          <p>
            Du wählst ein Thema, stimmst ab{" "}
            <span className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-sm font-semibold rounded">Zustimmen</span>
              {" / "}
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded">Neutral</span>
              {" / "}
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-sm font-semibold rounded">Ablehnen</span>
            </span>{" "}
            und kannst optional eine kurze Begründung schreiben. Du wählst deinen Kanton. Das
            war&apos;s. Kein Account, keine E-Mail, keine Registrierung.
          </p>
        </ManifestoSection>

        <ManifestoSection icon={<IconShield />} number="04" title="Datenschutz & Privatsphäre">
          <p className="mb-4">
            Stimme erhebt keine persönlichen Daten. Es wird keine E-Mail, kein Name, keine
            IP-Adresse gespeichert. Nur deine Meinung und dein Kanton werden übermittelt.
          </p>
          <ul className="space-y-2">
            {[
              "Keine Werbung",
              "Kein Tracking",
              "Keine Datenverkäufe",
              "Stimme ist und bleibt open source",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#DC0028" fillOpacity="0.12" />
                  <path d="M5 8l2 2 4-4" stroke="#DC0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </ManifestoSection>

        <ManifestoSection icon={<IconUsers />} number="05" title="Für wen ist Stimme?">
          <p className="mb-4">
            Für alle, die an einer informierten Schweiz interessiert sind.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Bürgerinnen & Bürger", desc: "Die ihre Meinung äussern wollen" },
              { label: "Organisationen", desc: "Die die Stimmung messen wollen" },
              { label: "Forschende", desc: "Die Daten für Studien brauchen" },
              { label: "Journalistinnen", desc: "Die verstehen was die Schweiz denkt" },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="font-semibold text-navy text-sm">{label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </ManifestoSection>

        {/* Last section — no dividing line below */}
        <div className="relative flex gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-red-50 border-2 border-swiss-red flex items-center justify-center">
              <IconSearch />
            </div>
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-swiss-red uppercase tracking-widest">06</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">Was kommt als Nächstes?</h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              Stimme wächst mit der Gemeinschaft. Neue Themen, mehr Kantone, tiefere Auswertungen —
              alles offen, alles transparent. Die Plattform gehört allen, die sie nutzen.
            </p>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Mach mit</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
            Deine Stimme zählt. Nimm an der Debatte teil — oder stelle eine neue Frage, die die
            Schweiz bewegt.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-navy font-bold rounded-lg hover:bg-gray-100 transition-colors text-center text-base"
            >
              Aktuelle Themen ansehen
            </Link>
            <Link
              href="/neu"
              className="w-full sm:w-auto px-8 py-3.5 bg-swiss-red hover:bg-swiss-red-dark text-white font-bold rounded-lg transition-colors text-center text-base"
            >
              + Neue Frage stellen
            </Link>
          </div>
        </div>
      </div>

      {/* Values strip */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "26", label: "Schweizer Kantone" },
              { stat: "100%", label: "Anonym" },
              { stat: "0", label: "Datenweitergaben" },
              { stat: "Open", label: "Source" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold text-swiss-red">{stat}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
