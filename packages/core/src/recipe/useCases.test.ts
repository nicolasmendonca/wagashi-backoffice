import {calculateIngredientQuantities} from './useCases';

describe('calculateIngredientQuantities', () => {
  it('returns an array with the summed ingredients of each recipe', () => {
    const chocotortaRecipe = {
      id: '1',
      name: 'Chocotorta',
      ingredients: [
        {id: '1', quantity: 10},
        {id: '2', quantity: 20},
      ],
    };
    const chocopandiRecipe = {
      id: '2',
      name: 'Chocopandi',
      ingredients: [
        {id: '1', quantity: 100},
        {id: '3', quantity: 120},
      ],
    };
    expect(calculateIngredientQuantities([chocotortaRecipe, chocopandiRecipe, chocotortaRecipe])).toEqual([
      {id: '1', total: 120},
      {id: '2', total: 40},
      {id: '3', total: 120},
    ]);
  });
});
