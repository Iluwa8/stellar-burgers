import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeeds } from '../../services/slices/feedsSlice';
import { selectUserOrders } from '../../services/slices/ordersSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeeds);
  const userOrders = useSelector(selectUserOrders);
  const [orderData, setOrderData] = useState<TOrder | null>(null);

  useEffect(() => {
    const orderNumber = Number(number);
    const orderFromStore =
      feedOrders.find((order) => order.number === orderNumber) ||
      userOrders.find((order) => order.number === orderNumber);

    if (orderFromStore) {
      setOrderData(orderFromStore);
      return;
    }

    if (number) {
      getOrderByNumberApi(orderNumber)
        .then((data) => setOrderData(data.orders[0]))
        .catch(() => setOrderData(null));
    }
  }, [number, feedOrders, userOrders]);

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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
