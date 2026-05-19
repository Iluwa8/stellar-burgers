import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectFeedsError,
  selectFeedsLoading
} from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeeds);
  const isLoading = useSelector(selectFeedsLoading);
  const error = useSelector(selectFeedsError);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium mt-10'>
        Ошибка загрузки ленты: {error}
      </p>
    );
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
