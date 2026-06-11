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

  it('parsar rad med bindestreck-prefix till ingrediens', () => {
    const result = parsePastedIngredients('- 2 dl grädde');
    expect(result).toEqual([{ quantity: '2', unit: 'dl', name: 'grädde', isSection: false }]);
  });

  it('parsar rad med numrering som prefix till ingrediens', () => {
    const result = parsePastedIngredients('1. 2 dl grädde');
    expect(result).toEqual([{ quantity: '2', unit: 'dl', name: 'grädde', isSection: false }]);
  });

  it('parsar rad utan prefix till ingrediens', () => {
    const result = parsePastedIngredients('2 dl grädde');
    expect(result).toEqual([{ quantity: '2', unit: 'dl', name: 'grädde', isSection: false }]);
  });

  it('parsar flerradig text med blandat format', () => {
    const text = ['# Dressing', '* 1 dl olivolja', '- 2 msk citronsaft', '3. salt', 'peppar'].join('\n');
    const result = parsePastedIngredients(text);
    expect(result).toEqual([
      { quantity: '', unit: '', name: 'Dressing', isSection: true },
      { quantity: '1', unit: 'dl', name: 'olivolja', isSection: false },
      { quantity: '2', unit: 'msk', name: 'citronsaft', isSection: false },
      { quantity: '', unit: '', name: 'salt', isSection: false },
      { quantity: '', unit: '', name: 'peppar', isSection: false },
    ]);
  });
});
