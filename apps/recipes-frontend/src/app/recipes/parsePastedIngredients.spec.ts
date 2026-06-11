import { parsePastedIngredients } from './parsePastedIngredients';

describe('parsePastedIngredients', () => {
  it('parsar en rad med asterisk-prefix till ingrediens', () => {
    const result = parsePastedIngredients('* 1 gurka');
    expect(result).toEqual([{ quantity: '1', unit: '', name: 'gurka', isSection: false }]);
  });

  it('parsar #-rad till sektionsrubrik', () => {
    const result = parsePastedIngredients('# Lime- och vitlöksdressing');
    expect(result).toEqual([{ quantity: '', unit: '', name: 'Lime- och vitlöksdressing', isSection: true }]);
  });
});
