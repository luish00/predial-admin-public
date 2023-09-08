import { useCallback, useEffect, useState } from 'react';
import { useApiGet, useFetch } from '../hooks';
import { UserGetResponse, UserRequestProp } from '../models';
import { useAppDispatch } from '../redux/hooks/reduxHooks';
import { loadUsers } from '../redux/slices/userSlice';
import { errorsToString } from './utils';

export const useGetUsersService = (runOnMount = true) => {
  const [users, setUsers] = useState<UserGetResponse[]>([]);
  const dispatch = useAppDispatch();

  const { get, isLoading, result } =
    useApiGet<UserGetResponse[]>('user/all');

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (result?.data) {
      setUsers(result.data.map((item) => ({
        ...item,
        FullName: `${item.FirstName} ${item.LastName}`,
        Status: item.IsActive ? 'Activo' : 'Inactivo',
      })));
    } else {
      setUsers([]);
    }
  }, [isLoading, result]);

  useEffect(() => {
    if (runOnMount) {
      get({});
    }
  }, []);

  useEffect(() => {
    dispatch(loadUsers(users));
  }, [users]);

  const refreshUsers = useCallback(({
    limit = 20,
    offset = 0,
    queries = {},
  } = { limit: 100, offset: 0, queries: {} }) => {


    get({ params: { limit, offset, ...queries } });
  }, [get]);

  return { refreshUsers, users, isLoadingUsers: isLoading };
};

export const useUsertByIdService = (id: string | number | null | undefined) => {
  const [user, setUser] = useState<UserGetResponse | null>(null);
  const { get, isLoading, result } =
    useApiGet<UserGetResponse>(`user/${id}`);

  useEffect(() => {
    if (isLoading || !result?.isValid) {
      return;
    }

    if (result.data) {
      const { data } = result;

      setUser({
        ...data,
        FullName: `${data.FirstName} ${data.LastName}`,
        Status: data.IsActive ? 'Activo' : 'Inactivo'
      });
    } else {
      setUser(null);
    }
  }, [isLoading, result]);

  const getUser = useCallback(() => {
    if (!id) {
      return;
    }

    get({});
  }, [get, id]);

  return {
    getUser,
    user,
    isLoadingGetUser: isLoading,
  };
};

export const useCreateUpdateUserSerivce = () => {
  const { post, put } = useFetch();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | undefined>('');
  const [userCreated, setUserCreated] = useState(false);
  const [isUserUpdated, setUserUpdated] = useState(false);

  const resetUserService = useCallback(() => {
    setErrors('');
    setUserCreated(false);
    setUserUpdated(false);
    setLoading(false);
  }, []);

  const createUser = useCallback(
    async (body: UserRequestProp) => {
      resetUserService();

      const response = await post({ path: 'user', body });

      if (response.isValid) {
        setErrors('');
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);
      setUserCreated(response.isValid);

      return response;
    },
    [],
  );

  const updateUser = useCallback(
    async (body: UserRequestProp) => {
      resetUserService();

      const response = await put({ path: `user/${body.Id}`, body });

      if (response.isValid) {
        setErrors('');
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);
      setUserUpdated(response.isValid);

      return response;
    },
    [],
  );

  return {
    userCreated,
    isUserUpdated,
    createUser,
    errors,
    isCreatingUser: isLoading,
    updateUser,
    resetUserService,
  };
};

export const useDeleteUserService = () => {
  const { del } = useFetch();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | undefined>('');
  const [userDeleted, setUserDeleted] = useState(false);

  const resetUserService = useCallback(() => {
    setErrors('');
    setUserDeleted(false);
    setLoading(false);
  }, []);


  const deleteUser = useCallback(
    async (id: string) => {
      resetUserService();

      const response = await del({ path: `user/${id}` });

      if (response.isValid) {
        setErrors('');
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);
      setUserDeleted(response.isValid);

      return response;
    },
    [],
  );

  return {
    isUserDeleting: isLoading,
    errors,
    deleteUser,
    userDeleted,
  };
};
