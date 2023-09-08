import { useCallback, useEffect, useState } from "react";
import { useApiGet } from "../hooks";
import { AttachmentProp } from "../types";
import { URL_BASE } from "../utils/contanst";

export const useGetListAttService = () => {
  const [data, setData] = useState<AttachmentProp[]>([]);

  const { get, isLoading, result } =
    useApiGet<AttachmentProp[]>('attachment');

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (result?.isValid && result?.data) {
      setData(result.data.map((item) => ({
        ...item,
        Body: `${URL_BASE}/${item.Body}`
      })));
    }
  }, [isLoading, result]);

  const getAttachmentByAccount = useCallback((id: string) => {
    get({ params: { parentId: id } });
  }, [get]);

  return {
    attachements: data,
    getAttachmentByAccount,
    isLoadingAttch: isLoading,
  };
};
