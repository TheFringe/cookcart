import { parseIngredientLine, parseTextRecipe } from './parseTextRecipe';

describe('parseIngredientLine', () => {
  it('parsar mängd, enhet och namn', () => {
    expect(parseIngredientLine('• 2 dl grädde')).toEqual({ quantity: '2', unit: 'dl', name: 'grädde', isSection: false });
  });

  it('parsar mängd och namn utan enhet', () => {
    expect(parseIngredientLine('• 2 avokado')).toEqual({ quantity: '2', unit: '', name: 'avokado', isSection: false });
  });

  it('parsar ingrediens utan mängd', () => {
    expect(parseIngredientLine('• färsk persilja')).toEqual({ quantity: '', unit: '', name: 'färsk persilja', isSection: false });
  });

  it('hanterar bråktal', () => {
    expect(parseIngredientLine('• 1/2 msk kebabkrydda')).toEqual({ quantity: '1/2', unit: 'msk', name: 'kebabkrydda', isSection: false });
  });

  it('hanterar parenteser i namn', () => {
    expect(parseIngredientLine('• 100 g fetaost (ca)')).toEqual({ quantity: '100', unit: 'g', name: 'fetaost (ca)', isSection: false });
  });
});

const FULL_TEXT = `Nikes Kebabgryta
from Mat och maräng

SERVINGS: 4

INGREDIENTS
• 1 gul lök
• 1 vitlöksklyfta
• 1 pase kycklingkebab
• 2 dl grädde
• färsk persilja

PREPARATION STEPS
1. Finhacka gulloken + vitloken.
2. Stek i olja.
3. Ner med kycklingkebaben.

SOURCE URL
https://www.instagram.com/reel/C46ILpVM9Jw/
`;

describe('parseTextRecipe', () => {
  it('extraherar receptnamnet', () => {
    expect(parseTextRecipe(FULL_TEXT).name).toBe('Nikes Kebabgryta');
  });

  it('extraherar source_name från "from"-raden', () => {
    expect(parseTextRecipe(FULL_TEXT).source_name).toBe('Mat och maräng');
  });

  it('extraherar portioner', () => {
    expect(parseTextRecipe(FULL_TEXT).servings).toBe(4);
  });

  it('extraherar ingredienser', () => {
    const result = parseTextRecipe(FULL_TEXT);
    expect(result.ingredients).toHaveLength(5);
    expect(result.ingredients?.[0]).toEqual({ quantity: '1', unit: '', name: 'gul lök', isSection: false });
    expect(result.ingredients?.[3]).toEqual({ quantity: '2', unit: 'dl', name: 'grädde', isSection: false });
    expect(result.ingredients?.[4]).toEqual({ quantity: '', unit: '', name: 'färsk persilja', isSection: false });
  });

  it('extraherar steg utan numrering', () => {
    const result = parseTextRecipe(FULL_TEXT);
    expect(result.steps).toHaveLength(3);
    expect(result.steps?.[0]).toBe('Finhacka gulloken + vitloken.');
    expect(result.steps?.[1]).toBe('Stek i olja.');
  });

  it('extraherar source_url', () => {
    expect(parseTextRecipe(FULL_TEXT).source_url).toBe('https://www.instagram.com/reel/C46ILpVM9Jw/');
  });

  it('behandlar # i ingredienssektionen som sektionsrubrik', () => {
    const text = [
      'Rätt',
      '',
      'INGREDIENTS',
      '• 2 dl Tomatsås',
      '# Pasta',
      '• 360 g Pasta',
    ].join('\n');
    const result = parseTextRecipe(text);
    expect(result.ingredients[0]).toEqual({ quantity: '2', unit: 'dl', name: 'Tomatsås', isSection: false });
    expect(result.ingredients[1]).toEqual({ quantity: '', unit: '', name: 'Pasta', isSection: true });
    expect(result.ingredients[2]).toEqual({ quantity: '360', unit: 'g', name: 'Pasta', isSection: false });
  });

  it('bevarar sektionsrubriker i stegen', () => {
    const text = [
      'Gremolata',
      '',
      'PREPARATION STEPS',
      '# Förberedelser',
      '1. Hacka persiljan.',
      '# Tillagning',
      '2. Blanda allt.',
    ].join('\n');
    const result = parseTextRecipe(text);
    expect(result.steps).toEqual(['# Förberedelser', 'Hacka persiljan.', '# Tillagning', 'Blanda allt.']);
  });

  it('hanterar fil utan valfria sektioner', () => {
    const minimal = `Enkel pasta\n\nINGREDIENTS\n• 200 g pasta\n\nPREPARATION STEPS\n1. Koka pastan.`;
    const result = parseTextRecipe(minimal);
    expect(result.name).toBe('Enkel pasta');
    expect(result.servings).toBeNull();
    expect(result.source_name).toBeNull();
    expect(result.source_url).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.steps).toHaveLength(1);
  });
});
