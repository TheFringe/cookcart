import axios from 'axios';

export interface RecipeImport {
  name?: string;
  description?: string;
  steps?: string[];
  cook_time_minutes?: number | null;
  servings?: number | null;
  tags?: string[];
  source_name?: string | null;
  source_url?: string | null;
  ingredients?: { name: string; quantity: string; unit: string }[];
}

export function parseIngredientString(s: string): { name: string; quantity: string; unit: string } {
  const trimmed = s.trim();
  // "2 dl mjölk", "1,5 liter vatten", "100 g fetaost (ca)"
  const withUnit = trimmed.match(/^([\d.,½¼¾\s/]+)\s+([a-zA-ZåäöÅÄÖ]+)\s+(.+)$/);
  if (withUnit) {
    return { quantity: withUnit[1].trim(), unit: withUnit[2], name: withUnit[3].trim() };
  }
  // "2 avokado" (number + name, no unit)
  const withoutUnit = trimmed.match(/^([\d.,½¼¾]+)\s+(.+)$/);
  if (withoutUnit) {
    return { quantity: withoutUnit[1], unit: '', name: withoutUnit[2].trim() };
  }
  return { quantity: '', unit: '', name: trimmed };
}

export function parseISODuration(duration: string): number | null {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!match) return null;
  const hours = parseInt(match[1] ?? '0', 10);
  const minutes = parseInt(match[2] ?? '0', 10);
  const total = hours * 60 + minutes;
  return total > 0 ? total : null;
}

function extractRecipeSchema(html: string): Record<string, unknown> | null {
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const data: unknown = JSON.parse(match[1]);
      if (isRecipeSchema(data)) return data as Record<string, unknown>;
      if (data && typeof data === 'object' && '@graph' in data) {
        const graph = (data as Record<string, unknown>)['@graph'];
        if (Array.isArray(graph)) {
          const recipe = graph.find(isRecipeSchema);
          if (recipe) return recipe as Record<string, unknown>;
        }
      }
      if (Array.isArray(data)) {
        const recipe = data.find(isRecipeSchema);
        if (recipe) return recipe as Record<string, unknown>;
      }
    } catch {
      // skip invalid JSON blocks
    }
  }
  return null;
}

function isRecipeSchema(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const type = (value as Record<string, unknown>)['@type'];
  return type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'));
}

function extractSteps(instructions: unknown): string[] {
  if (!instructions) return [];
  if (typeof instructions === 'string') {
    return instructions.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(instructions)) {
    return instructions.flatMap((item) => {
      if (typeof item === 'string') return [item.trim()];
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        if (obj.text) return [String(obj.text).trim()];
        if (obj.itemListElement) return extractSteps(obj.itemListElement);
      }
      return [];
    }).filter(Boolean);
  }
  return [];
}

function extractTags(schema: Record<string, unknown>): string[] {
  const tags: string[] = [];
  if (typeof schema.keywords === 'string') {
    tags.push(...schema.keywords.split(',').map((t) => t.trim()).filter(Boolean));
  } else if (Array.isArray(schema.keywords)) {
    tags.push(...(schema.keywords as string[]).map((t) => String(t).trim()).filter(Boolean));
  }
  if (schema.recipeCategory) {
    const cats = Array.isArray(schema.recipeCategory) ? schema.recipeCategory : [schema.recipeCategory];
    tags.push(...cats.map((c: unknown) => String(c).trim()).filter(Boolean));
  }
  return [...new Set(tags)];
}

function extractServings(value: unknown): number | null {
  if (!value) return null;
  const match = String(value).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function extractSourceName(schema: Record<string, unknown>): string | null {
  for (const field of ['author', 'publisher']) {
    const val = schema[field];
    if (!val) continue;
    const item = Array.isArray(val) ? val[0] : val;
    if (item && typeof item === 'object' && 'name' in item) return String((item as Record<string, unknown>).name);
    if (typeof item === 'string') return item;
  }
  return null;
}

export async function parseRecipeFromUrl(url: string): Promise<RecipeImport> {
  const response = await axios.get<string>(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RecipeImporter/1.0)' },
    responseType: 'text',
  });
  const schema = extractRecipeSchema(response.data);
  if (!schema) {
    throw new Error('Inget recept hittades på sidan');
  }
  const duration = (schema.totalTime ?? schema.cookTime) as string | undefined;
  return {
    name: schema.name ? String(schema.name) : undefined,
    description: schema.description ? String(schema.description) : undefined,
    steps: extractSteps(schema.recipeInstructions),
    cook_time_minutes: duration ? parseISODuration(duration) : null,
    servings: extractServings(schema.recipeYield),
    tags: extractTags(schema),
    source_url: typeof schema.url === 'string' ? schema.url : url,
    source_name: extractSourceName(schema),
    ingredients: Array.isArray(schema.recipeIngredient)
      ? (schema.recipeIngredient as string[]).map(parseIngredientString)
      : [],
  };
}
