import { useCallback, useState } from 'react';
import { useAuthUser } from 'react-auth-kit';

import { DEV_MODE, URL_BASE } from '../utils/contanst';

interface BodyFetch {
  body?: object;
  headers?: object;
  method: string;
  params?: object;
  token: string;
  url: string;
}

export interface ErrorsType {
  value: string;
  msg: string;
  param: string;
  location: string;
}

interface WrapperData<T> {
  isValid: boolean;
  message?: string;
  data?: T | null;
  status: number;
  error?: string;
  errors: ErrorsType[];
}

type MethodType = 'POST' | 'DELETE' | 'PUT';

interface FetchProps {
  body?: object;
  path: string;
  params?: object;
}

interface FetchGetProps {
  params?: object;
}

interface ApiFetchProps extends FetchProps {
  method: MethodType;
  token: string;
}

interface ApiServiceType<T> {
  apiCall: (params: FetchProps) => Promise<WrapperData<T>>;
  isLoading: boolean;
  result: WrapperData<T> | null;
}

interface ApiGetServiceType<T> {
  get: (params: FetchGetProps) => Promise<WrapperData<T>>;
  isLoading: boolean;
  result: WrapperData<T> | null;
}

const STATUS_WITH_RESPONSE = [200, 403];

export function saveData(key: string, data: any) {
  return localStorage.setItem(key, data);
}

export function getData(key: string) {
  return localStorage.getItem(key);
}

const tryLog = async ({ url, data, request }: any) => {
  if (!DEV_MODE) {
    return;
  }

  try {
    const { status } = request;
    if (status >= 300) {
      console.log('api log', { url, data, status });
    } else {
      console.log('api log', { url, status });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('api log catch', error.message);
    }
  }
};

// serializeForUri({ param0: 'value 0', param1: 'value:1' }) ===
// 'param0=value%200&param1=value%3A1'
function serializeForUri(obj = {}) {
  return Object.keys(obj)
    .map((key: string) => `${encodeURI(key)}=${encodeURI(obj[key as keyof typeof obj])}`)
    .join('&');
}

async function apiFetch({
  body,
  method,
  params = {},
  token,
  url,
}: BodyFetch): Promise<Response> {
  let rest = {};

  if (['POST', 'PUT'].includes(method)) {
    rest = { body: JSON.stringify(body) };
  }

  return fetch(`${URL_BASE}/api/${url}?${serializeForUri(params)}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    ...rest,
  });
}

/**
 *
 * @param method @default('POST')
 * @returns [result, apiCall, isLoading]
 *
 */
export const useApiService = <T>(
  method: MethodType = 'POST',
): ApiServiceType<T> => {
  const [result, setResult] = useState<WrapperData<T> | null>(null);
  const [isLoading, setLoading] = useState(false);
  let wrapperData: WrapperData<T>;

  const apiCall = async ({
    body = {},
    path = '',
    params = {},
  }: FetchProps): Promise<WrapperData<T>> => {
    setLoading(true);
    const bodyFetch: BodyFetch = {
      body,
      method,
      params,
      url: path,
    };

    try {
      const request = await apiFetch(bodyFetch);
      const data = await request.json();

      tryLog({ url: path, data, request });

      wrapperData = {
        data: request.status === 200 ? data : null,
        errors: request.status === 403 ? data : [],
        isValid: request.ok,
        status: request.status,
      };
    } catch (error) {
      let errorMessage = '';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      wrapperData = {
        data: null,
        errors: [],
        isValid: false,
        message: errorMessage,
        status: 500,
      };
    }

    setLoading(false);
    setResult(wrapperData);

    return wrapperData;
  };

  return { result, apiCall, isLoading };
};

export const useApiGet = <T>(url = ''): ApiGetServiceType<T> => {
  const [result, setResult] = useState<WrapperData<T> | null>(null);
  const [isLoading, setLoading] = useState(false);
  const auth = useAuthUser()();

  let wrapperData: WrapperData<T>;

  const get = async ({ params = {} } = {}): Promise<WrapperData<T>> => {
    setLoading(true);

    try {
      const request = await apiFetch({
        method: 'GET',
        params,
        token: auth?.user?.access_token,
        url,
      });
      const data = STATUS_WITH_RESPONSE.includes(request.status)
        ? await request.json()
        : null;

      tryLog({ url, data, request });

      wrapperData = {
        data: request.status === 200 ? data : null,
        errors: request.status === 403 ? data?.errors : [],
        isValid: request.ok,
        message: '',
        status: request.status,
      };
    } catch (error) {
      let errorMessage = '';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      wrapperData = {
        data: null,
        errors: [],
        isValid: false,
        message: errorMessage,
        status: 500,
      };
    }

    setLoading(false);
    setResult(wrapperData);

    return wrapperData;
  };

  return { get, isLoading, result };
};

const fetchWrapper = async <T>({
  body = {},
  method = 'POST',
  params = {},
  path = '',
  token = '',
}: ApiFetchProps): Promise<WrapperData<T>> => {
  let wrapperData: WrapperData<T>;
  const bodyFetch: BodyFetch = {
    body,
    method,
    params,
    token,
    url: path,
  };

  try {
    const request = await apiFetch(bodyFetch);
    const data = STATUS_WITH_RESPONSE.includes(request.status)
      ? await request.json()
      : null;
    tryLog({ url: path, data, request });

    wrapperData = {
      data: request.status === 200 ? data : null,
      errors: request.status === 403 ? data?.errors : [],
      isValid: request.ok,
      status: request.status,
    };
  } catch (error) {
    let errorMessage = '';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    wrapperData = {
      data: null,
      errors: [],
      isValid: false,
      message: errorMessage,
      status: 500,
    };
  }

  return wrapperData;
};

export const useFetch = <T>() => {
  const auth = useAuthUser()();

  const token = auth?.user?.access_token;

  const post = useCallback(async (params: FetchProps) => {
    return fetchWrapper<T>({ ...params, method: 'POST', token });
  }, []);

  const del = useCallback(async (params: FetchProps) => {
    return fetchWrapper<T>({ ...params, method: 'DELETE', token });
  }, []);

  const put = useCallback(async (params: FetchProps) => {
    return fetchWrapper<T>({ ...params, method: 'PUT', token });
  }, []);

  return { post, del, put };
};
