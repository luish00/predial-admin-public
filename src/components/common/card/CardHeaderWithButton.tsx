import { Card, Col, Row } from 'react-bootstrap';
import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const CardHeaderWithButton: React.FC<Props> = ({ title = '', children }) => (
  <Card.Header>
    <Row className="align-items-center">
      <Col md={2}>
        {title}
      </Col>

      <Col md={10} className="justify-content-end d-flex">
        {children}
      </Col>
    </Row>
  </Card.Header>
);
