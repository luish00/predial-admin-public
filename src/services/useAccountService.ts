import { useCallback, useEffect, useState } from 'react';
import { useApiGet, useFetch } from '../hooks';
import {
  AccountAssignUserRequest,
  AccountsGetResponse,
  ContactAccountResponse,
  CountTotal,
  CreateContactPayload,
} from '../models';
import { useAppDispatch } from '../redux/hooks/reduxHooks';
import { loadAccounts } from '../redux/slices/accountSlice';
import { AccountDetailsProp, ContactProp } from '../types';
import { errorsToString } from './utils';

export const useGetAccounts = () => {
  const dispatch = useAppDispatch();
  const [accounts, setAccounts] = useState<AccountsGetResponse[]>([]);
  const [total, setTotal] = useState<number>(0);

  const { get: getCount, isLoading: isCountLoading, result: countResult } =
    useApiGet<CountTotal>('account/count');

  const { get, isLoading, result } =
    useApiGet<AccountsGetResponse[]>('account/all');

  useEffect(() => {
    if (isLoading || !result?.isValid) {
      return;
    }

    if (result.data) {
      setAccounts(result.data.map((item) => ({
        ...item,
        FullName: `${item.FirstName} ${item.LastName}`,
        FullAddress: [item.Street, item.State, item.City, item.PostalCode]
          .filter(item => item?.length).join(', ')
      })));
    } else {
      setAccounts([]);
    }
  }, [isLoading, result]);

  useEffect(() => {
    if (isCountLoading || !countResult?.isValid) {
      return;
    }

    setTotal(countResult?.data?.count || 0);
  }, [isCountLoading, countResult]);

  useEffect(() => {
    get({});
    getCount({});
  }, []);

  useEffect(() => {
    dispatch(loadAccounts(accounts));
  }, [accounts]);

  const getAccounts = useCallback(({
    limit = 20,
    offset = 0,
    queries = {},
  }) => {
    get({ params: { limit, offset, ...queries } });
  }, [get]);

  return {
    getAccounts,
    countResult,
    accounts,
    totalAccount: total,
    isLoadingAccount: isLoading || isCountLoading,
  };
};

export const useGetAccountById = (id: string | number | null | undefined) => {
  const [account, setAccount] = useState<AccountsGetResponse | null>(null);

  const { get, isLoading, result } =
    useApiGet<AccountsGetResponse>(`account/${id}`);

  useEffect(() => {
    if (isLoading || !result?.isValid) {
      return;
    }

    if (result.data) {
      const { data } = result;

      setAccount({
        ...data,
        FullName: `${data.FirstName} ${data.LastName}`,
        FullAdress: [data.Street, data.State, data.City, data.PostalCode]
          .filter(item => item?.length).join(', '),
      });
    } else {
      setAccount(null);
    }
  }, [isLoading, result]);

  const getAccount = useCallback(() => {
    if (!id) {
      return;
    }

    get({});
  }, [get, id]);

  return {
    getAccount,
    account,
    isLoadingAccount: isLoading,
  };
};

export const useCreateContact = () => {
  const [isLoading, setLoading] = useState(false);
  const [contact, setContact] = useState<ContactProp | null>();
  const [errors, setErrors] = useState<string[]>([]);

  const { post, put } = useFetch<ContactAccountResponse>();

  const createOrUpdateContact = useCallback(
    (body: CreateContactPayload) => {
      const request = async () => {
        setLoading(true);
        setErrors([]);

        const isNew = !!body.Id;
        const path = isNew ? `contact/${body.Id}` : 'contact';
        const action = isNew ? put : post;

        const response = await action({ path, body });

        if (response.isValid && response.data) {
          const { data } = response;

          setContact({
            AccountId: data.AccountId,
            Email: data.Email,
            FirstName: data.FirstName,
            Id: data.Id,
            IsOwner: data.IsOwner,
            LastName: data.LastName,
            MiddleName: data.MiddleName,
            Mobile: data.Mobile,
            Name: data.Name,
            Phone: data.Phone,
            Relationship: data.Relationship,
          });
        } else {
          const responseError = response.errors?.map(item => item.msg);

          setErrors(responseError);
        }

        setLoading(false);
      };

      request();
    },
    [],
  );

  const resetAccountService = useCallback(() => {
    setErrors([]);
    setLoading(false);
    setContact(null);
  }, []);

  return {
    contact,
    createOrUpdateContact,
    errors,
    isLoading,
    resetAccountService,
  };
};

export const useCreateUpdateAccount = () => {
  const { post, put } = useFetch();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | undefined>('');
  const [accountCreated, setAccountCreated] = useState(false);

  const resetAccountService = useCallback(() => {
    setErrors('');
    setAccountCreated(false);
    setLoading(false);
  }, []);

  const createAccount = useCallback(
    async (body: AccountDetailsProp) => {
      resetAccountService();

      const response = await post({ path: 'account', body });

      if (response.isValid) {
        setErrors('');
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);
      setAccountCreated(response.isValid);

      return response;
    },
    [],
  );

  const updateAccount = useCallback(
    async (body: AccountDetailsProp) => {
      resetAccountService();

      const response = await put({ path: `account/${body.Id}`, body });

      if (response.isValid) {
        setErrors('');
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);
      setAccountCreated(response.isValid);

      return response;
    },
    [],
  );

  return {
    accountCreated,
    createAccount,
    errors,
    isCreatingAccount: isLoading,
    updateAccount,
    resetAccountService,
  };
};

export const useCreateUpdateAccountCsv = () => {
  const { post, put } = useFetch();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | undefined>('');
  const [accountCreated, setAccountCreated] = useState(false);

  const resetAccountService = useCallback(() => {
    setErrors('');
    setAccountCreated(false);
    setLoading(false);
  }, []);

  const createAccount = useCallback(
    async (body: AccountDetailsProp) => {
      resetAccountService();

      const response = await post({ path: 'account/csv', body });

      if (response.isValid) {
        setErrors('');
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);
      setAccountCreated(response.isValid);

      return response;
    },
    [],
  );

  const updateAccount = useCallback(
    async (body: AccountDetailsProp) => {
      resetAccountService();

      const response = await put({ path: `account/${body.Id}`, body });

      if (response.isValid) {
        setErrors('');
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);
      setAccountCreated(response.isValid);

      return response;
    },
    [],
  );

  return {
    accountCreated,
    createAccount,
    errors,
    isCreatingAccount: isLoading,
    updateAccount,
    resetAccountService,
  };
};


export const useUpdatAssignUserService = () => {
  const { put } = useFetch();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | undefined>('');
  const [isAcountUpdated, setAccountUpdated] = useState<boolean>(false);

  const resetAssignService = useCallback(() => {
    setErrors('');
    setLoading(false);
    setAccountUpdated(false);
  }, []);


  const updatAssignUser = useCallback(
    async (body: AccountAssignUserRequest) => {
      resetAssignService();

      const response = await put({ path: `account/assignUser`, body });

      if (response.isValid) {
        setErrors('');
        setAccountUpdated(true);
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);

      return response;
    },
    [],
  );

  return {
    errors,
    isAcountUpdated,
    isLoading,
    resetAssignService,
    updatAssignUser,
  };
};

export const useDeleteAccountService = () => {
  const { del } = useFetch();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | undefined>('');
  const [isAcountDeleted, setAccountDeleted] = useState<boolean>(false);

  const resetAssignService = useCallback(() => {
    setErrors('');
    setLoading(false);
    setAccountDeleted(false);
  }, []);

  const deleteAccount = useCallback(
    async (id: string) => {
      resetAssignService();

      const response = await del({ path: `account/${id}` });

      if (response.isValid) {
        setErrors('');
        setAccountDeleted(true);
      } else {
        setErrors(errorsToString(response.errors));
      }

      setLoading(false);

      return response;
    },
    [],
  );

  return {
    deleteAccount,
    errors,
    isAcountDeleted,
    isdDeleteingAccount: isLoading,
  };
};
