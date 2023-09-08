import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { AccountDetailsProp, ContactProp } from '../../types';

export interface AccountState {
  accounts: AccountDetailsProp[];
  accountDetails: AccountDetailsProp | null;
  contacts: ContactProp[];
}

const initialState: AccountState = {
  accounts: [],
  accountDetails: null,
  contacts: [],
};

export const accountDetailsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    loadAccount: (state, action: PayloadAction<AccountDetailsProp>) => {
      state.accountDetails = action.payload;
    },
    loadAccounts: (state, action: PayloadAction<AccountDetailsProp[]>) => {
      state.accounts = action.payload;
    },
    loadContacts: (state, action: PayloadAction<ContactProp[]>) => {
      state.contacts = action.payload;
    },
    updateAccount: (state, action: PayloadAction<ContactProp>) => {
      state.contacts = state.contacts.map(contact => {
        if (contact.Id === action.payload?.Id) {
          return action.payload;
        }

        return contact;
      });
    },
    addContact: (state, action: PayloadAction<ContactProp>) => {
      state.contacts.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addContact,
  loadAccount,
  loadAccounts,
  loadContacts,
  updateAccount,
} = accountDetailsSlice.actions;

export default accountDetailsSlice.reducer;
