import { useCallback, useEffect, useState } from "react";
import { useApiGet } from "../hooks";
import { ContactAccountResponse } from "../models";
import { ContactProp } from "../types";

export const useGetAccountContacts = () => {
  const [contacts, setContacts] = useState<ContactProp[]>([]);

  const { get, isLoading, result } =
    useApiGet<ContactAccountResponse[]>('contact');

  const getContacts = useCallback((id: string) => {
    if (!id) {
      return;
    }

    get({ params: { accountId: id } });
  }, []);

  useEffect(() => {
    if (isLoading || !result?.isValid || !result.data) {
      return;
    }

    setContacts(
      result.data.map(item => ({
        AccountId: item.AccountId,
        Email: item.Email,
        FirstName: item.FirstName,
        FullName: `${item.FirstName} ${item.LastName}`,
        Id: item.Id,
        IsOwner: item.IsOwner,
        LastName: item.LastName,
        MiddleName: item.MiddleName,
        Mobile: item.Mobile,
        Name: item.Name,
        Phone: item.Phone,
        Relationship: item.Relationship,
      })),
    );
  }, [isLoading, result]);

  return { contacts, getContacts, isLoading };
};
