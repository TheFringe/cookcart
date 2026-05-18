export type Recipe = {
  id: number;
  name: string;
  description: string | null;
  cook_time_minutes: number | null;
  servings: number | null;
  steps: string[];
};
