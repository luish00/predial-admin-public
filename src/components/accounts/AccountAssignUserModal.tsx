import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Modal, Spinner } from 'react-bootstrap';
import { useUpdatAssignUserService } from '../../services/useAccountService';
import { useGetUsersService } from '../../services';

interface Props {
  accountsId: string[];
  onHide: () => void;
  onUpdatedAccount: () => void;
  show: boolean;
}

export const AccountAssignUserModal: React.FC<Props> = ({
  accountsId,
  onHide,
  onUpdatedAccount,
  show,
}) => {
  const [userId, setUserId] = useState<string>('');

  const { isLoadingUsers, refreshUsers, users } = useGetUsersService(false);
  const {
    errors,
    isLoading: isAssingLoading,
    isAcountUpdated,
    updatAssignUser,
    resetAssignService,
  } = useUpdatAssignUserService();

  const onSelectedUser = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const { target: { value } } = event;

    setUserId(value);
  }, []);

  const handleHide = useCallback(() => {
    setUserId('');

    if (isAcountUpdated) {
      onUpdatedAccount();
    }

    resetAssignService();
    onHide();
  }, [onHide, isAcountUpdated]);

  const onSubmit = useCallback(() => {
    if (isLoadingUsers) {
      return;
    }

    updatAssignUser({ UserId: userId, AccountIds: accountsId });
  }, [userId, accountsId, isAssingLoading]);

  useEffect(() => {
    if (!show || users.length > 0) {
      return;
    }

    refreshUsers();
  }, [show, users]);

  return (
    <Modal
      aria-labelledby="modal-assign-manager"
      backdrop="static"
      centered
      onHide={handleHide}
      show={show}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-assign-manager" as="h5">
          Asignar gestor a cuentas
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <Form>
            <Form.Group>
              <Form.Label>Gestores</Form.Label>

              <Form.Select
                disabled={isLoadingUsers || isAssingLoading}
                onChange={onSelectedUser}
                value={userId}
              >
                <option value="">Seleciona...</option>

                {users?.map(item => (
                  <option key={String(item.Id)} value={item.Id}>
                    {item.FullName} - {item.UserName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {errors && (
              <Alert variant="danger">
                {errors}
              </Alert>
            )}

            {isAcountUpdated && (
              <Alert className="m-v-8" variant="success">
                ¡Cuentas actualizadas!
              </Alert>
            )}
          </Form>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleHide} variant="outline-seconday">
          Cerrar
        </Button>

        <Button
          disabled={isLoadingUsers || !userId || isAssingLoading}
          onClick={onSubmit}
          variant="outline-primary"
        >
          {isAssingLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true" /><span className="visually-hidden">Cargando...</span>
            </>
          )
            : 'Asignar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
