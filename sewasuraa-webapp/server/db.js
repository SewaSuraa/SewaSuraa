const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "app.db"));

// Tabelle für Codes
db.exec(`
CREATE TABLE IF NOT EXISTS access_codes (
  code TEXT PRIMARY KEY,
  is_active INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);
`);

// Beispiel-Codes (nur wenn noch leer)
const count = db.prepare("SELECT COUNT(*) AS c FROM access_codes").get().c;
if (count === 0) {
  const ins = db.prepare("INSERT INTO access_codes(code, is_active, note) VALUES(?,?,?)");
  ins.run("SEWA-1111", 1, "Testkunde 1");
  ins.run("SEWA-2222", 1, "Testkunde 2");
  ins.run("SEWA-3333", 0, "Deaktiviert");
}

module.exports = db;
