import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeeds } from '../../services/slices/feedsSlice';
import { selectUserOrders } from '../../services/slices/ordersSlice';
import {
  fetchOrderByNumber,
  selectOrderInfo,
  selectOrderInfoLoading,
  selectOrderInfoError,
  clearOrderInfo,
  setOrderFromCache
} from '../../services/slices/orderInfoSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeeds);
  const userOrders = useSelector(selectUserOrders);
  const orderData = useSelector(selectOrderInfo);
  const isLoading = useSelector(selectOrderInfoLoading);
  const loadError = useSelector(selectOrderInfoError);

  useEffect(() => {
    const orderNumber = Number(number);
    if (!number || Number.isNaN(orderNumber)) {
      return undefined;
    }

    const orderFromStore =
      feedOrders.find((order) => order.number === orderNumber) ||
      userOrders.find((order) => order.number === orderNumber);

    if (orderFromStore) {
      dispatch(setOrderFromCache(orderFromStore));
    } else {
      dispatch(fetchOrderByNumber(orderNumber));
    }

    return () => {
      dispatch(clearOrderInfo());
    };
  }, [number, feedOrders, userOrders, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading && !orderData) {
    return <Preloader />;
  }

  if (loadError && !orderData) {
    return <p className='text text_type_main-medium pt-10'>{loadError}</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
