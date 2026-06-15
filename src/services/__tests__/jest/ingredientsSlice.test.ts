import ingredientsReducer, {
  fetchIngredients,
  initialState
} from '../../slices/ingredientsSlice';

const mockIngredients = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: 'bun.png',
    image_large: 'bun_large.png',
    image_mobile: 'bun_mobile.png'
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    proteins: 5,
    fat: 2,
    carbohydrates: 10,
    calories: 50,
    price: 50,
    image: 'sauce.png',
    image_large: 'sauce_large.png',
    image_mobile: 'sauce_mobile.png'
  }
];

describe('ingredientsSlice reducer', () => {
  it('должен обрабатывать fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(
        new Error(errorMessage),
        '',
        undefined,
        errorMessage
      )
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
