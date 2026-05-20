ALTER TABLE shopping_list_items
  ADD CONSTRAINT shopping_list_items_list_ingredient_unique
  UNIQUE (list_id, ingredient_id);
