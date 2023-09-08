import React from 'react';
import { Container } from 'react-bootstrap';

import './ContainerCard.css';

interface Props {
  children: React.ReactNode;
}

const ContainerCard: React.FC<Props> = ({ children }) => {
  return (
    <Container className="Container-card">
      {children}
    </Container>
  );
};

export { ContainerCard };
