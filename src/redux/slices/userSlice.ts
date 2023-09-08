import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { UserGetResponse } from '../../models';

export interface AccountState {
  users: UserGetResponse[];
}

const initialState: AccountState = {
  users: [],
};

export const accountDetailsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUsers: (state, action: PayloadAction<UserGetResponse[]>) => {
      state.users = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loadUsers } = accountDetailsSlice.actions;

export default accountDetailsSlice.reducer;
