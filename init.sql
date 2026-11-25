CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO items (name)
SELECT v.name
FROM (VALUES ('Первый элемент'), ('Второй элемент'), ('Третий элемент')) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM items);
