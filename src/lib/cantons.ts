export interface Canton {
  abbr: string;
  name: string;
  color: string;
  primary?: boolean;
}

export const CANTONS: Canton[] = [
  { abbr: "ZH", name: "Zürich", color: "#1a6ec8", primary: true },
  { abbr: "BE", name: "Bern", color: "#e8a000" },
  { abbr: "LU", name: "Luzern", color: "#0066b3" },
  { abbr: "UR", name: "Uri", color: "#ffcc00" },
  { abbr: "SZ", name: "Schwyz", color: "#cc0000" },
  { abbr: "OW", name: "Obwalden", color: "#cc0000" },
  { abbr: "NW", name: "Nidwalden", color: "#cc0000" },
  { abbr: "GL", name: "Glarus", color: "#000000" },
  { abbr: "ZG", name: "Zug", color: "#0055a5" },
  { abbr: "FR", name: "Freiburg", color: "#000000" },
  { abbr: "SO", name: "Solothurn", color: "#cc0000" },
  { abbr: "BS", name: "Basel-Stadt", color: "#000000" },
  { abbr: "BL", name: "Basel-Landschaft", color: "#cc0000" },
  { abbr: "SH", name: "Schaffhausen", color: "#000000" },
  { abbr: "AR", name: "Appenzell Ausserrhoden", color: "#000000" },
  { abbr: "AI", name: "Appenzell Innerrhoden", color: "#000099" },
  { abbr: "SG", name: "St. Gallen", color: "#006600" },
  { abbr: "GR", name: "Graubünden", color: "#000099" },
  { abbr: "AG", name: "Aargau", color: "#000000" },
  { abbr: "TG", name: "Thurgau", color: "#009900" },
  { abbr: "TI", name: "Tessin", color: "#cc0000" },
  { abbr: "VD", name: "Waadt", color: "#009900" },
  { abbr: "VS", name: "Wallis", color: "#cc0000" },
  { abbr: "NE", name: "Neuenburg", color: "#009900" },
  { abbr: "GE", name: "Genf", color: "#ffcc00" },
  { abbr: "JU", name: "Jura", color: "#cc0000" },
];

export function getCantonByAbbr(abbr: string): Canton | undefined {
  return CANTONS.find((c) => c.abbr === abbr);
}

export const CANTON_ABBRS = CANTONS.map((c) => c.abbr);
