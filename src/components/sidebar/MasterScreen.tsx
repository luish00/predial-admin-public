import React from 'react';
import { RequireAuth } from 'react-auth-kit';
import { Outlet } from 'react-router-dom';

import { SideBar } from './SideBar';

const MasterScreen = () => (
  <RequireAuth loginPath="/login">
    <SideBar>
      <Outlet />
    </SideBar>
  </RequireAuth>
);

export { MasterScreen };

