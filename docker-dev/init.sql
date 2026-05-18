CREATE TABLE recipes (
    id          SERIAL PRIMARY KEY,
    name        TEXT        NOT NULL,
    description TEXT,
    steps       JSONB       NOT NULL DEFAULT '[]',
    servings    INTEGER,
    cook_time_minutes INTEGER,
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
    unit          TEXT NOT NULL
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
