import { rootReducer } from '../../RootReducer';
import store from '../../store';

describe('rootReducer', () => {
  it('должен правильно инициализировать состояние', () => {
    const state = store.getState();
    expect(state).toEqual(rootReducer(undefined, { type: '@@INIT' }));
  });

  it('должен возвращать начальное состояние при вызове с undefined', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orderInfo');
  });
});
