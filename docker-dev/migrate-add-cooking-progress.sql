CREATE TABLE IF NOT EXISTS recipe_cooking_progress (
    recipe_id          INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE PRIMARY KEY,
    checked_ingredients TEXT[]  NOT NULL DEFAULT '{}',
    checked_steps       INTEGER[] NOT NULL DEFAULT '{}'
);
