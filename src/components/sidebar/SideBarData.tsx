import HomeIcon from '@material-ui/icons/Home';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons//People';
import RecentActorsIcon from '@material-ui/icons//RecentActors';
import AssignmentIcon from '@material-ui/icons/Assignment';

import React from 'react';

interface Props {
  icon: React.ReactNode;
  link: string;
  title: string;
}

export const SideBarData: Props[] = [
  // {
  //   icon: <HomeIcon />,
  //   link: '/home',
  //   title: 'Inicio',
  // },
  {
    icon: <PeopleIcon />,
    link: '/users',
    title: 'Usuarios',
  },
  {
    icon: <RecentActorsIcon />,
    link: '/accounts',
    title: 'Cuentas',
  },
  {
    icon: <AssignmentIcon />,
    link: '/tasks',
    title: 'Tareas',
  },
  {
    icon: <LogoutIcon />,
    link: 'logout',
    title: 'Cerrar sesión',
  },
];