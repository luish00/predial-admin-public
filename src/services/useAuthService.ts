import { useCallback, useEffect, useState } from 'react';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

import { useApiService } from '../hooks';
import { LoginRequest, LoginResponse } from '../models';

export const useLoginService = () => {
  const signIn = useSignIn();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    apiCall,
    isLoading,
    result: loginState,
  } = useApiService<LoginResponse>();

  const doLogin = useCallback(
    async (body: LoginRequest) => {
      if (isLoading) {
        return;
      }
      
      setError('');

      const { isValid, data } = await apiCall({ path: 'user/login', body });

      if (isValid && data?.access_token) {
        signIn({
          authState: { user: data },
          expiresIn: 480, // 8h
          token: data.access_token,
          tokenType: 'Bearer',
        });
      } else {
        setError('Usuario o contraseña incorrecta.');
      }
    },
    [apiCall, isLoading, signIn],
  );

  useEffect(() => {
    if (!loginState?.isValid || !loginState.data) {
      return;
    }

    navigate('/');
  }, [loginState, navigate]);

  return { doLogin, isLoading, errorLogin: error };
};
