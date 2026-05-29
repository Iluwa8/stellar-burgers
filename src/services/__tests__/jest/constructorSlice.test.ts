import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../../slices/constructorSlice';

describe('burgerConstructor slice reducer', () => {
  const mockBun = {
    _id: 'bun1',
    name: 'Булка',
    type: 'bun' as const,
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: 'bun.png',
    image_large: 'bun_large.png',
    image_mobile: 'bun_mobile.png',
    id: 'bun-uuid'
  };

  const mockIngredient = {
    _id: 'ing1',
    name: 'Соус',
    type: 'sauce' as const,
    proteins: 5,
    fat: 2,
    carbohydrates: 10,
    calories: 50,
    price: 50,
    image: 'sauce.png',
    image_large: 'sauce_large.png',
    image_mobile: 'sauce_mobile.png',
    id: 'ing-uuid'
  };

  it('должен обрабатывать экшен добавления булки', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(mockBun)
    );
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен заменять булку при добавлении новой', () => {
    const anotherBun = {
      ...mockBun,
      _id: 'bun2',
      id: 'bun-uuid-2',
      name: 'Другая булка'
    };
    const stateWithBun = burgerConstructorReducer(
      initialState,
      addIngredient(mockBun)
    );
    const state = burgerConstructorReducer(
      stateWithBun,
      addIngredient(anotherBun)
    );
    expect(state.bun).toEqual(anotherBun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать экшен добавления начинки', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockIngredient);
    expect(state.bun).toBeNull();
  });

  it('должен обрабатывать экшен удаления ингредиента', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        mockIngredient,
        { ...mockIngredient, _id: 'ing2', id: 'ing-uuid-2' }
      ]
    };
    const state = burgerConstructorReducer(
      stateWithIngredients,
      removeIngredient(0)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('ing2');
  });

  it('должен обрабатывать экшен изменения порядка ингредиентов', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, _id: 'ing1', id: 'uuid-1' },
        { ...mockIngredient, _id: 'ing2', id: 'uuid-2' },
        { ...mockIngredient, _id: 'ing3', id: 'uuid-3' }
      ]
    };
    const state = burgerConstructorReducer(
      stateWithIngredients,
      moveIngredient({ from: 0, to: 2 })
    );
    expect(state.ingredients[0]._id).toBe('ing2');
    expect(state.ingredients[1]._id).toBe('ing3');
    expect(state.ingredients[2]._id).toBe('ing1');
  });

  it('должен обрабатывать экшен очистки конструктора', () => {
    const stateWithData = {
      ...initialState,
      bun: mockBun,
      ingredients: [mockIngredient]
    };
    const state = burgerConstructorReducer(stateWithData, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
