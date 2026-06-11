import { parseIngredientLine, IngredientDraft } from './parseTextRecipe';

export function parsePastedIngredients(text: string): IngredientDraft[] {
  return text.split('\n').flatMap((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return [{ quantity: '', unit: '', name: trimmed.slice(2), isSection: true }];
    }
    if (trimmed.startsWith('* ')) {
      return [parseIngredientLine(line.replace(/^\*\s+/, ''))];
    }
    return [];
  });
}
