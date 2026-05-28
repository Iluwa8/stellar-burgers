import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectUserLoading,
  selectUserError,
  selectUser
} from '../../services/slices/userSlice';
import { TLoginData } from '../../utils/burger-api';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data: TLoginData = { email, password };
    dispatch(loginUser(data));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      registerLinkState={location.state}
    />
  );
};
