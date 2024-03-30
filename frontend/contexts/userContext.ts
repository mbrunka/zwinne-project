import { CurrentUserContext } from '@/pages/_app';
import { useContext } from 'react';

export const useUserState = () => useContext(CurrentUserContext);
