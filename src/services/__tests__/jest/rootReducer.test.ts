import { rootReducer } from '../../RootReducer';
import { initialState as ingredientsInitialState } from '../../slices/ingredientsSlice';
import { initialState as feedsInitialState } from '../../slices/feedsSlice';
import { initialState as ordersInitialState } from '../../slices/ordersSlice';
import { initialState as userInitialState } from '../../slices/userSlice';
import { initialState as constructorInitialState } from '../../slices/constructorSlice';
import { initialState as orderInfoInitialState } from '../../slices/orderInfoSlice';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при вызове с undefined', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      feeds: feedsInitialState,
      orders: ordersInitialState,
      user: userInitialState,
      burgerConstructor: constructorInitialState,
      orderInfo: orderInfoInitialState
    });
  });
});
