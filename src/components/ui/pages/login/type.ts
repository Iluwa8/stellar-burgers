import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';

export type LoginUIProps = PageUIProps & {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  /** Сохраняет state (например from) при переходе на регистрацию */
  registerLinkState?: unknown;
};
