import React from 'react';
import { useAuthUser } from 'react-auth-kit';

const Home: React.FC = () => {
  const auth = useAuthUser();
  const userInfo = auth()?.user;

  return (
    <div>
      <h3>Hola {userInfo.FirstName}</h3>
    </div>
  );
};

export { Home };
