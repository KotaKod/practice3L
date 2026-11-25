const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.APP_PORT || 3000);

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "myapp",
  user: process.env.DB_USER || "app_user",
  password: process.env.DB_PASSWORD || "change_me"
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "error", message: "database unavailable" });
  }
});

app.get("/api/items", async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM items ORDER BY id");
    res.json(result.rows);
  } catch (_error) {
    res.status(500).json({ error: "database query failed" });
  }
});

app.get("/api/items/count", async (_req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*)::int AS count FROM items");
    res.json({ count: result.rows[0].count });
  } catch (_error) {
    res.status(500).json({ error: "database query failed" });
  }
});

app.get("/", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="ru">
      <head><meta charset="utf-8"><title>GitHub Actions Practice</title></head>
      <body>
        <h1>Учебное веб-приложение</h1>
        <p>Приложение работает в Docker Compose и подключено к PostgreSQL.</p>
        <p><a href="/health">Проверка состояния</a></p>
        <p><a href="/api/items">Данные из базы</a></p>
      </body>
    </html>
  `);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Application listening on port ${port}`);
});
