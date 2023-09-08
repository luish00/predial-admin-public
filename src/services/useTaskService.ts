import { useCallback, useEffect, useState } from 'react';
import { useApiGet, useFetch } from '../hooks';
import { CountTotal, LastTaskGetResponse, TaskGetResponse } from '../models';
import { TaskProp } from '../types';
import { formateDateMx } from '../utils/dateUtils';
import { errorsToString } from './utils';

export const useGetListTasksService = () => {
  const [lastTasks, setLastTask] = useState<LastTaskGetResponse[]>([]);
  const [total, setTotal] = useState<number>(0);

  const { get, isLoading, result } =
    useApiGet<LastTaskGetResponse[]>('task/last');
  const { get: getCount, isLoading: isCountLoading, result: countResult } =
    useApiGet<CountTotal>('task/count');

  useEffect(() => {
    if (isLoading || !result?.isValid) {
      return;
    }

    if (result.data) {
      setLastTask(result.data.map((item) => ({
        ...item,
        CreatedDate: new Date(item.CreatedDate).toLocaleDateString('es-mx'),
        PaymentPromise: new Date(item.PaymentPromise).toLocaleDateString('es-mx'),
        TypeNotification: item.PersonalNotification ? 'Personal' : 'Instructivo',
      })));
    } else {
      setLastTask([]);
    }
  }, [isLoading, result]);

  useEffect(() => {
    if (isCountLoading || !countResult?.isValid) {
      return;
    }

    setTotal(countResult?.data?.count || 0);
  }, [isCountLoading, countResult]);

  useEffect(() => {
    getCount({});
    get({});
  }, []);

  const getTasks = useCallback(({ limit = 20, offset = 0 }) => {
    get({ params: { limit, offset } });
  }, [get]);

  return {
    countResult,
    getTasks,
    isLoadingTask: isLoading || isCountLoading,
    lastTasks,
    totalTask: total,
  };
};

export const useGetTaskService = (accountId: string | undefined) => {
  const { get, isLoading, result } = useApiGet<TaskProp[]>('task');
  const [data, setData] = useState<TaskProp[]>([]);

  useEffect(() => {
    if (!result?.isValid || !result?.data) {
      result;
    }

    const filterData: TaskProp[] =
      result?.data?.map((item: TaskProp) => ({
        ...item,
        CreatedDate: formateDateMx(item.CreatedDate),
        PaymentPromise: formateDateMx(item.PaymentPromise),
        TypeNotification: item.PersonalNotification ? 'Personal' : 'Instructivo',
      })) || [];

    setData(filterData);
  }, [result]);

  const getTasks = useCallback(() => {
    if (!accountId) {
      return;
    }

    get({ params: { accountId } });
  }, [accountId]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return {
    data,
    getTasks,
    isLoading,
    result,
  };
};

export const useGetTaskOneService = (id: string) => {
  const { get, isLoading, result } = useApiGet<TaskGetResponse>(`task/${id}`);
  const [data, setData] = useState<TaskGetResponse>();

  useEffect(() => {
    if (!result || !result?.isValid || !result?.data) {
      return;
    }

    const filterData: TaskGetResponse =
      {
        ...result?.data,
        CreatedDate: formateDateMx(result?.data.CreatedDate),
        PaymentPromise: formateDateMx(result?.data.PaymentPromise),
        TypeNotification: result?.data.PersonalNotification ? 'Personal' : 'Instructivo',
      };

    setData(filterData);
  }, [result]);

  const getTask = useCallback(() => {
    if (!id) {
      return;
    }

    get({});
  }, [id]);

  useEffect(() => {
    getTask();
  }, [getTask]);

  return {
    data,
    getTask,
    isLoading,
  };
};

export const useDeleteTaskService = () => {
  const { del } = useFetch();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | undefined>('');
  const [userDeleted, setUserDeleted] = useState(false);

  const resetService = useCallback(() => {
    setErrors('');
    setUserDeleted(false);
    setLoading(false);
  }, []);

  const deleteTask = useCallback(
    async (id: string) => {
      resetService();

      const response = await del({ path: `task/${id}` });

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
    isTaskeleting: isLoading,
    errors,
    deleteTask,
    userDeleted,
  };
};
