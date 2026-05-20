CREATE TABLE IF NOT EXISTS meal_plan (
    id         SERIAL PRIMARY KEY,
    recipe_id  INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    date       DATE    NOT NULL
);

CREATE INDEX IF NOT EXISTS meal_plan_date_idx ON meal_plan(date);
