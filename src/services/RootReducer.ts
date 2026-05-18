import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import feedsReducer from './slices/feedsSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';
import constructorReducer from './slices/constructorSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  user: userReducer,
  burgerConstructor: constructorReducer
});

export type RootState = ReturnType<typeof rootReducer>;
