import axios from 'axios';
import { parseRecipeFromUrl, parseIngredientString, parseISODuration } from './import';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

const RECIPE_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Recipe',
  name: 'Pasta Carbonara',
  description: 'En klassisk italiensk rätt.',
  recipeYield: '4 portioner',
  totalTime: 'PT30M',
  keywords: 'pasta, italiensk',
  recipeCategory: 'Middag',
  author: { '@type': 'Person', name: 'Kocken' },
  url: 'https://koket.se/pasta-carbonara',
  recipeIngredient: ['400 g pasta', '200 g pancetta', 'salt'],
  recipeInstructions: [
    { '@type': 'HowToStep', text: 'Koka pastan.' },
    { '@type': 'HowToStep', text: 'Stek pancettan.' },
  ],
});

function makeHtml(jsonLd: string) {
  return `<html><head><script type="application/ld+json">${jsonLd}</script></head></html>`;
}

beforeEach(() => jest.clearAllMocks());

describe('parseRecipeFromUrl', () => {
  it('extraherar receptets namn', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.name).toBe('Pasta Carbonara');
  });

  it('extraherar beskrivning', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.description).toBe('En klassisk italiensk rätt.');
  });

  it('extraherar steg från HowToStep-objekt', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.steps).toEqual(['Koka pastan.', 'Stek pancettan.']);
  });

  it('extraherar tillagningstid i minuter', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.cook_time_minutes).toBe(30);
  });

  it('extraherar portioner', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.servings).toBe(4);
  });

  it('extraherar taggar från keywords och recipeCategory', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.tags).toContain('pasta');
    expect(result.tags).toContain('italiensk');
    expect(result.tags).toContain('Middag');
  });

  it('extraherar källnamn från author', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.source_name).toBe('Kocken');
  });

  it('extraherar ingredienser', async () => {
    mockedAxios.get.mockResolvedValue({ data: makeHtml(RECIPE_JSON_LD) });

    const result = await parseRecipeFromUrl('https://koket.se/pasta-carbonara');

    expect(result.ingredients).toHaveLength(3);
    expect(result.ingredients?.[0]).toEqual({ quantity: '400', unit: 'g', name: 'pasta' });
  });

  it('kastar fel när ingen Recipe-schema finns', async () => {
    mockedAxios.get.mockResolvedValue({ data: '<html><head></head></html>' });

    await expect(parseRecipeFromUrl('https://example.com')).rejects.toThrow();
  });

  it('hittar schema i @graph-struktur', async () => {
    const graphJson = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: 'Koket' },
        { '@type': 'Recipe', name: 'Soppa', recipeIngredient: [], recipeInstructions: [] },
      ],
    });
    mockedAxios.get.mockResolvedValue({ data: makeHtml(graphJson) });

    const result = await parseRecipeFromUrl('https://koket.se/soppa');

    expect(result.name).toBe('Soppa');
  });
});

describe('parseIngredientString', () => {
  it('parsar mängd, enhet och namn', () => {
    expect(parseIngredientString('2 dl mjölk')).toEqual({ quantity: '2', unit: 'dl', name: 'mjölk' });
  });

  it('parsar ingrediens utan enhet', () => {
    expect(parseIngredientString('2 avokado')).toEqual({ quantity: '2', unit: '', name: 'avokado' });
  });

  it('parsar ingrediens utan mängd', () => {
    expect(parseIngredientString('salt')).toEqual({ quantity: '', unit: '', name: 'salt' });
  });

  it('parsar ingrediens med parentes i namn', () => {
    expect(parseIngredientString('100 g fetaost (ca)')).toEqual({ quantity: '100', unit: 'g', name: 'fetaost (ca)' });
  });
});

describe('parseISODuration', () => {
  it('parsar minuter', () => {
    expect(parseISODuration('PT30M')).toBe(30);
  });

  it('parsar timmar och minuter', () => {
    expect(parseISODuration('PT1H30M')).toBe(90);
  });

  it('parsar bara timmar', () => {
    expect(parseISODuration('PT2H')).toBe(120);
  });

  it('returnerar null för ogiltig sträng', () => {
    expect(parseISODuration('ingen duration')).toBeNull();
  });
});
