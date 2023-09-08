import React from 'react';

interface Props {
  icon: string;
  clazz?: string;
}

/** icons @link(https://fonts.google.com/icons?icon.style=Filled&icon.set=Material+Icons) */
export const MaterialIcon: React.FC<Props> = ({ icon, clazz }) => (
  <i className={`material-icons ${clazz}`}>{icon}</i>
);
