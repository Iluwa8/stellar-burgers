import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  // Пока проверяем авторизацию — показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если роут только для неавторизованных (логин, регистрация) и пользователь авторизован
  if (onlyUnAuth && user) {
    // Редирект на главную или на страницу, с которой пришли
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // Если роут защищён и пользователь не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
