-- Gör alla ingrediensnamn gemener för konsekvent deduplicering.
-- Kör: podman exec -i postgres psql -U recipes -d recipes < docker-dev/migrate-lowercase-ingredients.sql
--
-- OBS: Om det redan finns kollistioner (t.ex. 'Mjölk' och 'mjölk' som separata rader)
-- misslyckas UPDATE på UNIQUE-constraintet. Återskapa databasen i så fall med init.sql + seed.sql.

UPDATE ingredients
SET name = LOWER(name)
WHERE name != LOWER(name);
