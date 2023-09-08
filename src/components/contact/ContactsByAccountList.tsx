import React, { useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useGetAccountContacts } from '../../services/useContactService';
import { Table, TableKeyProps } from '../common/tables/Table';

interface Props {
  accountId: string;
}

const KEYS: TableKeyProps[] = [
  { key: 'Id', value: 'Id' },
  { key: 'Relationship', value: 'Relación' },
  { key: 'FullName', value: 'Nombre' },
  { key: 'Phone', value: 'Teléfono' },
  { key: 'Mobile', value: 'Movil' },
  { key: 'Email', value: 'Correo' },
];

export const ContactsByAccountList: React.FC<Props> = ({ accountId }) => {
  const { contacts, getContacts, isLoading } = useGetAccountContacts();

  useEffect(() => {
    if (!accountId) {
      return;
    }

    getContacts(accountId);
  }, [accountId]);

  return (
    <>
      <Container>
        <Card>
          <Card.Header as="h5">
            Lista de contactos
          </Card.Header>

          <Card.Body>
            <Table
              isLoading={isLoading}
              keys={KEYS}
              values={contacts}
            />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
