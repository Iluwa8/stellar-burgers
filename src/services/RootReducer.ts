import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingridientsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer
});
