import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Stimme – Deine Meinung zählt",
  description: "Die Schweizer Meinungsplattform für Zürich und alle Kantone",
};

function MicrophoneIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block"
    >
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans bg-gray-50 min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="bg-navy text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                <span className="text-swiss-red">
                  <MicrophoneIcon />
                </span>
                <span className="text-2xl font-bold tracking-tight">Stimme</span>
                <span className="hidden sm:inline text-xs text-gray-400 font-normal mt-1 ml-1">
                  Schweizer Meinungsplattform
                </span>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/"
                  className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-navy-light rounded-md transition-colors"
                >
                  Themen
                </Link>
                <Link
                  href="/?kanton=ZH"
                  className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-navy-light rounded-md transition-colors"
                >
                  Zürich
                </Link>
                <Link
                  href="/kantone"
                  className="hidden sm:block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-navy-light rounded-md transition-colors"
                >
                  Alle Kantone
                </Link>
                <Link
                  href="/neu"
                  className="ml-2 px-4 py-2 text-sm font-semibold bg-swiss-red hover:bg-swiss-red-dark text-white rounded-md transition-colors"
                >
                  + Neue Frage
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-navy text-gray-400 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-swiss-red">
                    <MicrophoneIcon />
                  </span>
                  <span className="text-white font-bold text-lg">Stimme</span>
                </div>
                <p className="text-sm">Eine Plattform für Schweizer Meinungen</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Kategorien</h3>
                <ul className="space-y-1 text-sm">
                  {["Politik", "Gesellschaft", "Verkehr", "Umwelt", "Wirtschaft", "Bildung"].map((cat) => (
                    <li key={cat}>
                      <Link href={`/?kategorie=${cat}`} className="hover:text-white transition-colors">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Kantone</h3>
                <p className="text-sm">Meinungen aus allen 26 Schweizer Kantonen</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {["ZH", "BE", "GE", "BS", "SG", "LU"].map((k) => (
                    <span key={k} className="text-xs bg-navy-light px-2 py-0.5 rounded text-gray-300">
                      {k}
                    </span>
                  ))}
                  <span className="text-xs text-gray-500">+20</span>
                </div>
              </div>
            </div>
            <div className="border-t border-navy-light mt-8 pt-6 text-center text-xs text-gray-500">
              © 2024 Stimme – Meinungsplattform für die Schweiz
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
