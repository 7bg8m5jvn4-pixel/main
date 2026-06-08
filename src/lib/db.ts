import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;
function getSql() {
  if (!_sql) _sql = neon(process.env.POSTGRES_URL!);
  return _sql;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  author_canton: string;
  active: number;
  zustimmen_count?: number;
  neutral_count?: number;
  ablehnen_count?: number;
  total_opinions?: number;
}

export interface Opinion {
  id: string;
  topic_id: string;
  vote: "zustimmen" | "neutral" | "ablehnen";
  text: string | null;
  canton: string;
  created_at: string;
  author_name: string | null;
}

export async function initDb() {
  await getSql()`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT now()::text,
      author_canton TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    )
  `;
  await getSql()`
    CREATE TABLE IF NOT EXISTS opinions (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      vote TEXT NOT NULL,
      text TEXT,
      canton TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT now()::text,
      author_name TEXT
    )
  `;
}

export async function getTopicsWithStats(): Promise<Topic[]> {
  const rows = await getSql()`
    SELECT
      t.*,
      COALESCE(SUM(CASE WHEN o.vote = 'zustimmen' THEN 1 ELSE 0 END), 0)::int as zustimmen_count,
      COALESCE(SUM(CASE WHEN o.vote = 'neutral' THEN 1 ELSE 0 END), 0)::int as neutral_count,
      COALESCE(SUM(CASE WHEN o.vote = 'ablehnen' THEN 1 ELSE 0 END), 0)::int as ablehnen_count,
      COUNT(o.id)::int as total_opinions
    FROM topics t
    LEFT JOIN opinions o ON t.id = o.topic_id
    WHERE t.active = 1
    GROUP BY t.id, t.title, t.description, t.category, t.created_at, t.author_canton, t.active
    ORDER BY COUNT(o.id) DESC, t.created_at DESC
  `;
  return rows as Topic[];
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const rows = await getSql()`
    SELECT
      t.*,
      COALESCE(SUM(CASE WHEN o.vote = 'zustimmen' THEN 1 ELSE 0 END), 0)::int as zustimmen_count,
      COALESCE(SUM(CASE WHEN o.vote = 'neutral' THEN 1 ELSE 0 END), 0)::int as neutral_count,
      COALESCE(SUM(CASE WHEN o.vote = 'ablehnen' THEN 1 ELSE 0 END), 0)::int as ablehnen_count,
      COUNT(o.id)::int as total_opinions
    FROM topics t
    LEFT JOIN opinions o ON t.id = o.topic_id
    WHERE t.id = ${id}
    GROUP BY t.id, t.title, t.description, t.category, t.created_at, t.author_canton, t.active
  `;
  return ((rows as Topic[])[0]) ?? null;
}

export async function getOpinionsByTopicId(topicId: string): Promise<Opinion[]> {
  const rows = await getSql()`
    SELECT * FROM opinions WHERE topic_id = ${topicId} ORDER BY created_at DESC
  `;
  return rows as Opinion[];
}

export async function createTopic(
  topic: Omit<Topic, "active" | "zustimmen_count" | "neutral_count" | "ablehnen_count" | "total_opinions">
): Promise<Topic> {
  await getSql()`
    INSERT INTO topics (id, title, description, category, created_at, author_canton, active)
    VALUES (${topic.id}, ${topic.title}, ${topic.description}, ${topic.category}, ${topic.created_at}, ${topic.author_canton}, 1)
  `;
  return (await getTopicById(topic.id)) as Topic;
}

export async function createOpinion(opinion: Opinion): Promise<Opinion> {
  await getSql()`
    INSERT INTO opinions (id, topic_id, vote, text, canton, created_at, author_name)
    VALUES (${opinion.id}, ${opinion.topic_id}, ${opinion.vote}, ${opinion.text}, ${opinion.canton}, ${opinion.created_at}, ${opinion.author_name})
  `;
  return opinion;
}

export async function seedDatabase() {
  await initDb();

  const topics = [
    { id: "topic-1", title: "Soll Zürich mehr Velowege bauen?", description: "Die Stadt Zürich diskutiert den Ausbau des Velonetzes. Befürworter sehen darin eine nachhaltige Lösung für den Stadtverkehr, Gegner befürchten Staus und Parkplatzverluste für Autos.", category: "Verkehr", created_at: "2024-01-15 10:00:00", author_canton: "ZH" },
    { id: "topic-2", title: "Homeoffice-Pflicht für Bundesbehörden?", description: "Sollen Bundesbehörden verpflichtet werden, mindestens 40% Homeoffice anzubieten? Dies würde den Pendlerverkehr reduzieren und die Work-Life-Balance verbessern.", category: "Politik", created_at: "2024-01-20 14:00:00", author_canton: "BE" },
    { id: "topic-3", title: "Soll der Zürichsee für Motorboote gesperrt werden?", description: "Umweltschützer fordern ein Motorbootverbot auf dem Zürichsee zum Schutz der Wasserqualität und der Tierwelt. Freizeitkapitäne sehen ihren Sport bedroht.", category: "Umwelt", created_at: "2024-02-01 09:00:00", author_canton: "ZH" },
    { id: "topic-4", title: "Braucht Zürich eine neue U-Bahn-Linie?", description: "Mit dem Bevölkerungswachstum stösst das Tramnetz an seine Grenzen. Eine U-Bahn-Linie würde Entlastung bringen, kostet aber Milliarden.", category: "Verkehr", created_at: "2024-02-10 11:00:00", author_canton: "ZH" },
    { id: "topic-5", title: "Soll die Schweiz der EU beitreten?", description: "Die bilateralen Verträge stehen zur Neuverhandlung. Soll die Schweiz den Weg eines vollständigen EU-Beitritts prüfen oder den bilateralen Weg weiterverfolgen?", category: "Politik", created_at: "2024-02-15 08:00:00", author_canton: "ZH" },
    { id: "topic-6", title: "Soll das Rentenalter auf 67 erhöht werden?", description: "Die AHV steht unter Druck. Eine Erhöhung des Rentenalters auf 67 würde die Finanzierung sichern, aber Arbeitnehmer länger im Arbeitsleben halten.", category: "Gesellschaft", created_at: "2024-02-20 15:00:00", author_canton: "BE" },
  ];

  const opinions = [
    { id: "op-1", topic_id: "topic-1", vote: "zustimmen", text: "Mehr Velowege bedeuten weniger Autos und sauberere Luft.", canton: "ZH", created_at: "2024-01-16 09:00:00", author_name: "Maria K." },
    { id: "op-2", topic_id: "topic-1", vote: "zustimmen", text: "Als täglicher Velofahrer begrüsse ich jeden neuen Veloweg.", canton: "ZH", created_at: "2024-01-16 10:30:00", author_name: "Peter S." },
    { id: "op-3", topic_id: "topic-1", vote: "ablehnen", text: "Die Innenstadt hat schon zu wenig Parkplätze.", canton: "ZH", created_at: "2024-01-17 08:00:00", author_name: "Hans M." },
    { id: "op-4", topic_id: "topic-1", vote: "neutral", text: "Ausbau ja, aber bitte mit Rücksicht auf alle Verkehrsteilnehmer.", canton: "AG", created_at: "2024-01-17 14:00:00", author_name: "Sandra B." },
    { id: "op-5", topic_id: "topic-1", vote: "zustimmen", text: "Zürich braucht dringend mehr sichere Velowege. Vorbild Amsterdam!", canton: "BE", created_at: "2024-01-18 11:00:00", author_name: "Lukas W." },
    { id: "op-6", topic_id: "topic-1", vote: "zustimmen", text: "Klimaschutz beginnt in der Stadt.", canton: "ZH", created_at: "2024-01-19 16:00:00", author_name: "Emma R." },
    { id: "op-7", topic_id: "topic-2", vote: "zustimmen", text: "Homeoffice reduziert den Pendlerverkehr und schont die Umwelt.", canton: "ZH", created_at: "2024-01-21 09:00:00", author_name: "Thomas F." },
    { id: "op-8", topic_id: "topic-2", vote: "neutral", text: "Gut gemeint, aber eine Pflicht greift zu weit.", canton: "BE", created_at: "2024-01-21 11:00:00", author_name: "Anna L." },
    { id: "op-9", topic_id: "topic-2", vote: "ablehnen", text: "Homeoffice ist nicht für alle Berufe geeignet.", canton: "LU", created_at: "2024-01-22 10:00:00", author_name: "Fritz K." },
    { id: "op-10", topic_id: "topic-2", vote: "zustimmen", text: "Seit meinem Homeoffice-Wechsel spare ich täglich 2 Stunden Pendelzeit.", canton: "SG", created_at: "2024-01-23 14:00:00", author_name: "Claudia M." },
    { id: "op-11", topic_id: "topic-2", vote: "neutral", text: "Die Work-Life-Balance verbessert sich, aber sozialer Zusammenhalt leidet.", canton: "ZG", created_at: "2024-01-24 15:00:00", author_name: "Marc H." },
    { id: "op-12", topic_id: "topic-3", vote: "zustimmen", text: "Der Zürichsee ist ein Naturjuwel. Motorboote haben dort nichts zu suchen!", canton: "ZH", created_at: "2024-02-02 10:00:00", author_name: "Ursula T." },
    { id: "op-13", topic_id: "topic-3", vote: "ablehnen", text: "Ich fahre seit 20 Jahren mit meinem Boot auf dem See. Das ist Tradition!", canton: "ZH", created_at: "2024-02-02 11:00:00", author_name: "Ruedi O." },
    { id: "op-14", topic_id: "topic-3", vote: "zustimmen", text: "Lärm und Abgase vergällen das Badevergnügen.", canton: "SZ", created_at: "2024-02-03 09:00:00", author_name: "Heidi N." },
    { id: "op-15", topic_id: "topic-3", vote: "neutral", text: "Elektroboote sollten erlaubt bleiben. Nur Verbrennungsmotoren verbieten.", canton: "ZH", created_at: "2024-02-04 12:00:00", author_name: "Daniel E." },
    { id: "op-16", topic_id: "topic-4", vote: "zustimmen", text: "Das Tram-Netz ist überlastet. Eine U-Bahn wäre ein Quantensprung!", canton: "ZH", created_at: "2024-02-11 08:00:00", author_name: "Stefan J." },
    { id: "op-17", topic_id: "topic-4", vote: "ablehnen", text: "Milliarden für eine U-Bahn? Lieber das bestehende Netz optimieren.", canton: "ZH", created_at: "2024-02-11 09:00:00", author_name: "Barbara G." },
    { id: "op-18", topic_id: "topic-4", vote: "zustimmen", text: "Als Pendlerin aus Winterthur begrüsse ich jede Erweiterung des ÖV.", canton: "ZH", created_at: "2024-02-12 10:00:00", author_name: "Karin P." },
    { id: "op-19", topic_id: "topic-4", vote: "neutral", text: "Gute Idee langfristig, aber die Kosten müssen sorgfältig geprüft werden.", canton: "AG", created_at: "2024-02-13 14:00:00", author_name: "Werner Z." },
    { id: "op-20", topic_id: "topic-4", vote: "zustimmen", text: "München, Wien, Berlin - alle haben eine U-Bahn. Zürich sollte nachziehen.", canton: "ZH", created_at: "2024-02-14 11:00:00", author_name: "Florian B." },
    { id: "op-21", topic_id: "topic-5", vote: "ablehnen", text: "Die Schweiz ist neutral und souverän. Das soll so bleiben!", canton: "SZ", created_at: "2024-02-16 09:00:00", author_name: "Anton V." },
    { id: "op-22", topic_id: "topic-5", vote: "zustimmen", text: "Für bessere Zusammenarbeit in Europa wäre ein Beitritt sinnvoll.", canton: "GE", created_at: "2024-02-16 11:00:00", author_name: "Sophie D." },
    { id: "op-23", topic_id: "topic-5", vote: "ablehnen", text: "Bilaterale Verträge sind ausreichend. Volle Souveränität ist der Schweizer Weg.", canton: "ZH", created_at: "2024-02-17 10:00:00", author_name: "Urs M." },
    { id: "op-24", topic_id: "topic-5", vote: "neutral", text: "Das Thema ist komplex. Zuerst brauchen wir eine breite gesellschaftliche Debatte.", canton: "BE", created_at: "2024-02-18 14:00:00", author_name: "Petra W." },
    { id: "op-25", topic_id: "topic-5", vote: "ablehnen", text: "Direkte Demokratie würde im EU-Rahmen geschwächt.", canton: "UR", created_at: "2024-02-19 16:00:00", author_name: "Josef A." },
    { id: "op-26", topic_id: "topic-6", vote: "ablehnen", text: "Wir haben unser Leben lang gearbeitet. Jetzt reichen 65 Jahre!", canton: "ZH", created_at: "2024-02-21 09:00:00", author_name: "Margrit S." },
    { id: "op-27", topic_id: "topic-6", vote: "zustimmen", text: "Die Lebenserwartung steigt. Es ist fair, etwas länger zu arbeiten.", canton: "ZG", created_at: "2024-02-21 10:00:00", author_name: "Roland F." },
    { id: "op-28", topic_id: "topic-6", vote: "ablehnen", text: "Viele können nicht bis 65 arbeiten, geschweige denn bis 67!", canton: "BE", created_at: "2024-02-22 11:00:00", author_name: "Monika K." },
    { id: "op-29", topic_id: "topic-6", vote: "neutral", text: "Flexible Rentenmodelle wären besser als ein fixes Rentenalter.", canton: "BS", created_at: "2024-02-23 14:00:00", author_name: "Christian H." },
    { id: "op-30", topic_id: "topic-6", vote: "ablehnen", text: "Nein zur Rentenaltererhöhung! Höhere Lohnbeiträge wären besser.", canton: "ZH", created_at: "2024-02-24 15:00:00", author_name: "Elisabeth P." },
  ];

  for (const t of topics) {
    await getSql()`
      INSERT INTO topics (id, title, description, category, created_at, author_canton, active)
      VALUES (${t.id}, ${t.title}, ${t.description}, ${t.category}, ${t.created_at}, ${t.author_canton}, 1)
      ON CONFLICT (id) DO NOTHING
    `;
  }

  for (const o of opinions) {
    await getSql()`
      INSERT INTO opinions (id, topic_id, vote, text, canton, created_at, author_name)
      VALUES (${o.id}, ${o.topic_id}, ${o.vote}, ${o.text}, ${o.canton}, ${o.created_at}, ${o.author_name})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function resetDatabase() {
  await getSql()`DELETE FROM opinions`;
  await getSql()`DELETE FROM topics`;
  await seedDatabase();
}
