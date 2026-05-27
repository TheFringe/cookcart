export type Ingredient = {
  name: string;
  quantity: number | null;
  unit: string;
  section?: string | null;
};

export type Recipe = {
  id: number;
  name: string;
  description: string | null;
  cook_time_minutes: number | null;
  servings: number | null;
  source_name: string | null;
  source_url: string | null;
  tags: string[];
  steps: string[];
  ingredients: Ingredient[];
};
