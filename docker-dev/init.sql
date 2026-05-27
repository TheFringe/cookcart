CREATE TABLE recipes (
    id          SERIAL PRIMARY KEY,
    name        TEXT        NOT NULL,
    description TEXT,
    steps       JSONB       NOT NULL DEFAULT '[]',
    servings    INTEGER,
    cook_time_minutes INTEGER,
    source_name TEXT,
    source_url  TEXT,
    tags        TEXT[]      NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ingredients (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL UNIQUE,
    default_unit TEXT
);

CREATE TABLE recipe_ingredients (
    id            SERIAL PRIMARY KEY,
    recipe_id     INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
    quantity      NUMERIC(10, 2) NOT NULL,
    unit          TEXT NOT NULL,
    section_name  TEXT
);

CREATE INDEX ON recipe_ingredients(recipe_id);
CREATE INDEX ON recipe_ingredients(ingredient_id);

CREATE TABLE shopping_lists (
    id         SERIAL PRIMARY KEY,
    name       TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shopping_list_recipes (
    list_id   INTEGER NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    PRIMARY KEY (list_id, recipe_id)
);

CREATE TABLE shopping_list_items (
    id            SERIAL PRIMARY KEY,
    list_id       INTEGER NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
    quantity      NUMERIC(10, 2) NOT NULL,
    unit          TEXT NOT NULL,
    checked       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX ON shopping_list_items(list_id);
ALTER TABLE shopping_list_items
  ADD CONSTRAINT shopping_list_items_list_ingredient_unique
  UNIQUE (list_id, ingredient_id);

CREATE TABLE recipe_cooking_progress (
    recipe_id          INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE PRIMARY KEY,
    checked_ingredients TEXT[]  NOT NULL DEFAULT '{}',
    checked_steps       INTEGER[] NOT NULL DEFAULT '{}'
);

CREATE TABLE meal_plan (
    id         SERIAL PRIMARY KEY,
    recipe_id  INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    date       DATE    NOT NULL
);

CREATE INDEX ON meal_plan(date);

CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    google_id  TEXT        NOT NULL UNIQUE,
    email      TEXT        NOT NULL,
    name       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
