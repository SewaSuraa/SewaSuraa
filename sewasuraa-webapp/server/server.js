const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const crypto = require("crypto");
const path = require("path");
const db = require("./db");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Statische Website aus /public ausliefern
app.use("/", express.static(path.join(__dirname, "..", "public")));

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

// Session prüfen (Token im Header: Authorization: Bearer <token>)
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: "NO_TOKEN" });

  const row = db.prepare("SELECT * FROM sessions WHERE token=?").get(token);
  if (!row) return res.status(401).json({ ok: false, error: "INVALID_TOKEN" });

  const now = new Date();
  const exp = new Date(row.expires_at);
  if (now > exp) return res.status(401).json({ ok: false, error: "EXPIRED" });

  req.session = row;
  next();
}

// Login mit Code
app.post("/api/login", (req, res) => {
  const code = String(req.body.code || "").trim().toUpperCase();
  if (!code) return res.status(400).json({ ok: false, error: "NO_CODE" });

  const found = db.prepare("SELECT * FROM access_codes WHERE code=?").get(code);
  if (!found) return res.status(401).json({ ok: false, error: "CODE_NOT_FOUND" });
  if (found.is_active !== 1) return res.status(401).json({ ok: false, error: "CODE_INACTIVE" });

  const token = makeToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Tage
  db.prepare("INSERT INTO sessions(token, code, expires_at) VALUES(?,?,?)")
    .run(token, code, expires.toISOString());

  res.json({ ok: true, token, expires_at: expires.toISOString() });
});

// Beispiel: geschützte API
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ ok: true, code: req.session.code });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server läuft auf http://localhost:" + PORT));
