import React, { useCallback, useState } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { AccountsGetResponse, UserGetResponse } from '../../../models';
import { useCreateUpdateAccount } from '../../../services/useAccountService';
import { AccountDetailsProp } from '../../../types';
import { AccountModalSuccess } from '../AccountModalSuccess';

interface Props {
  account: AccountsGetResponse | null;
  modeEdit: boolean;
  onUpdateAccount: (_: number) => void;
  userAssinged?: UserGetResponse | null;
  users: UserGetResponse[] | [];
}

export const EditAssingToUser: React.FC<Props> = ({
  account,
  modeEdit = false,
  onUpdateAccount,
  userAssinged,
  users,
}) => {
  const { updateAccount, isCreatingAccount } = useCreateUpdateAccount();
  const [userId, setUserId] = useState(userAssinged?.Id);
  const [showModal, setShowModal] = useState(false);

  const onChangeManager: React.ChangeEventHandler<any> = useCallback(({ target }) => {
    const { value } = target;

    setUserId(value);
  }, []);

  const onSubmitChangeUser = useCallback((event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (!userId || !account) {
      return;
    }

    const accountToUpdate: AccountDetailsProp = {
      ...account,
      Assigned2UserId: userId,
    };

    const update = async () => {
      const response = await updateAccount(accountToUpdate);

      if (response.isValid && response.data) {
        setShowModal(true);
        onUpdateAccount(parseInt(userId, 2));
      }
    };

    update();
  }, [users, userId]);

  if (!modeEdit) {
    return null;
  }

  return (
    <>
      <Card className="m-b-8">
        <Card.Header as="h5">Gestores</Card.Header>

        <Card.Body>
          <div className="m-b-8">
            <Form onSubmit={onSubmitChangeUser}>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Gestores</Form.Label>

                    <Form.Select
                      name="Assigned2UserId"
                      onChange={onChangeManager}
                      required
                      value={userAssinged?.Id}
                    >
                      <>
                        <option value="">Selecciona...</option>
                        {users.map((user) => (
                          <option key={String(user.Id)} value={user.Id}>{user.FullName}</option>
                        ))}
                      </>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={1}>
                  <Button
                    disabled={!userId}
                    style={{ marginTop: '2rem' }}
                    type="submit"
                    variant="outline-primary"
                  >
                    {isCreatingAccount
                      ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true" />

                          <span className="visually-hidden">Cargando...</span>
                        </>)
                      : <span>Actualizar</span>}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Card.Body>
      </Card>

      <AccountModalSuccess
        id={account?.Id}
        accountCreated={showModal}
        handleHide={() => setShowModal(false)}
        onCreateAccountSuccess={() => setShowModal(false)}
      />
    </>
  );
};
