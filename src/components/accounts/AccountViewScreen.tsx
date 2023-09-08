import React, { useEffect, useMemo, useState } from 'react';
import { Card, Container, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { AccountsGetResponse } from '../../models';
import { useAppSelector } from '../../redux/hooks/reduxHooks';
import { ACCOUNT_KEYS } from './AccountListScreen';

import { ContactsByAccountList } from '../contact';
import { TaskByAccount } from '../tasks/TaskByAccount';
import { useGetAccountById } from '../../services/useAccountService';
import { AccountDetails } from './accountDetails';

export const AccountViewScreen: React.FC = () => {
  const store = useAppSelector(({ accounts }) => accounts);
  const { accounts } = store;
  const { id } = useParams();
  const [key, setKey] = useState('details');

  const { account, getAccount, isLoadingAccount } = useGetAccountById(id);

  const accountMemo: AccountsGetResponse | null | undefined = useMemo(() => {
    if (account) {
      return account;
    }

    if (accounts.length === 0) {
      return null;
    }

    return accounts.find((item) => id === String(item.Id)) as AccountsGetResponse;
  }, [accounts, account]);


  useEffect(() => {
    if (accountMemo) {
      return;
    }

    getAccount();
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={3} className="p-b-8">
            <Card>
              <Card.Header as="h5">Detalle de la cuenta</Card.Header>

              <Card.Body>
                <Card.Title>{`Resumen ${isLoadingAccount ? 'Cargando...' : ''}`}</Card.Title>

                <div>
                  {ACCOUNT_KEYS.map(item => (
                    <div key={item.key}>
                      <strong>{`${item.value}: `}</strong>
                      <span>{accountMemo && accountMemo[item.key]}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tabs
              activeKey={key}
              className="mb-3"
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              onSelect={(k) => setKey(String(k))}
            >
              <Tab eventKey="details" title="Detalle">
               <AccountDetails account={accountMemo} />
              </Tab>

              <Tab eventKey="conact" title="Contactos">
                <ContactsByAccountList accountId={id || ''} />
              </Tab>

              <Tab eventKey="task" title="Tareas">
                <TaskByAccount accountId={id || ''} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};
