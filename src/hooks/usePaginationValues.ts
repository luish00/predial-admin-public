import { useCallback, useState } from "react";

export interface ServiceParams { limit: number, offset: number }
export type ServiceType = ({ limit, offset }: ServiceParams) => void;

export const usePaginationValues = (service: ServiceType) => {
  const [page, setPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(20);

  const handleOnChangeInterperPage = useCallback((nextValue: number) => {
    setItemPerPage(nextValue);

    service({ limit: nextValue, offset: page });
  }, [page, service]);

  const handleOnPrev = useCallback(() => {
    const newPage = page - 1;
    setPage(newPage);

    service({ limit: itemPerPage, offset: newPage });
  }, [page, itemPerPage, service]);

  const handleOnNext = useCallback(() => {
    const newPage = page + 1;
    setPage(newPage);

    service({ limit: itemPerPage, offset: newPage });
  }, [page, itemPerPage]);

  return {
    handleOnChangeInterperPage,
    handleOnNext,
    handleOnPrev,
    itemPerPage,
    page,
  };
};
