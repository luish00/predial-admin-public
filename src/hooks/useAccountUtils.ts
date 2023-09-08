import { useMemo } from "react";
import { AccountDetailsProp, ContactProp } from "../types";

const useAccountUtils = (account: AccountDetailsProp | null | undefined) => {
  const fullAccountName = useMemo(() => {
    if (!account) {
      return '';
    }

    const value = [account.FirstName, account.MiddleName, account.LastName];

    return value.filter(item => !!item).join(' ');
  }, [account]);

  const fullAccountAddress = useMemo(() => {
    if (!account) {
      return '';
    }

    const value = [
      account.State,
      account.City,
      account.Street,
      account.PostalCode,
    ];

    return value.filter(item => !!item).join(', ');
  }, [account]);

  return { fullAccountName, fullAccountAddress };
};

const useAccountContactUtils = (contact: ContactProp | null | undefined) => {
  const fullContactsName = useMemo(() => {
    if (!contact) {
      return '';
    }

    const value = [contact.FirstName, contact.MiddleName, contact.LastName];

    return value.filter(item => !!item).join(' ');
  }, [contact]);

  return { fullContactsName };
};

export { useAccountUtils, useAccountContactUtils };
