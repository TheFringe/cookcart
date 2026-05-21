type IngredientDraft = { quantity: string; unit: string; name: string };

const WITH_UNIT = /^([\d.,½¼¾\s/]+)\s+(dl|cl|ml|l|kg|g|mg|msk|tsk|krm|st|stk|port|cm|mm)\s+(.+)$/i;
const WITHOUT_UNIT = /^([\d.,½¼¾/]+)\s+(.+)$/;

export function parseIngredientLine(line: string): IngredientDraft {
  const raw = line.replace(/^[•]\s*/, '').trim();
  const withUnit = WITH_UNIT.exec(raw);
  if (withUnit) {
    return { quantity: withUnit[1].trim(), unit: withUnit[2], name: withUnit[3].trim() };
  }
  const withoutUnit = WITHOUT_UNIT.exec(raw);
  if (withoutUnit) {
    return { quantity: withoutUnit[1].trim(), unit: '', name: withoutUnit[2].trim() };
  }
  return { quantity: '', unit: '', name: raw };
}

type ParsedRecipe = {
  name: string;
  source_name: string | null;
  servings: number | null;
  source_url: string | null;
  ingredients: IngredientDraft[];
  steps: string[];
};

export function parseTextRecipe(text: string): ParsedRecipe {
  const lines = text.split('\n');
  const result: ParsedRecipe = {
    name: '',
    source_name: null,
    servings: null,
    source_url: null,
    ingredients: [],
    steps: [],
  };

  type Section = 'header' | 'ingredients' | 'steps' | 'source_url';
  let section: Section = 'header';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === 'INGREDIENTS') { section = 'ingredients'; continue; }
    if (trimmed === 'PREPARATION STEPS') { section = 'steps'; continue; }
    if (trimmed === 'SOURCE URL') { section = 'source_url'; continue; }

    if (section === 'header') {
      if (!result.name && trimmed) {
        result.name = trimmed;
        continue;
      }
      if (result.name && !result.source_name && trimmed.startsWith('from ')) {
        result.source_name = trimmed.slice(5).trim();
        continue;
      }
      const servingsMatch = /^SERVINGS:\s*(\d+)/.exec(trimmed);
      if (servingsMatch) {
        result.servings = Number(servingsMatch[1]);
        continue;
      }
    }

    if (section === 'ingredients' && trimmed.startsWith('•')) {
      result.ingredients.push(parseIngredientLine(trimmed));
      continue;
    }

    if (section === 'steps') {
      const stepMatch = /^\d+\.\s+(.+)/.exec(trimmed);
      if (stepMatch) {
        result.steps.push(stepMatch[1]);
      }
      continue;
    }

    if (section === 'source_url' && trimmed) {
      result.source_url = trimmed;
      section = 'header';
    }
  }

  return result;
}
