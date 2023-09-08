import React, { useCallback, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Container,
  Alert,
} from 'react-bootstrap';

import { Table, TableKeyProps } from '../common/tables/Table';
import { DeleteBasicModal } from '../common/modals';
import { AccountsGetResponse, UserRequestProp } from '../../models';
import { MaterialIcon } from '../common/icons/MaterialIcon';
import { useDeleteUserService, useGetUsersService } from '../../services/useUserService';
import { UserCreateUpdateModal } from './UserCreateUpdateModal';
import { ServiceParams, usePaginationValues } from '../../hooks/usePaginationValues';
import { useOnChangeState } from '../../hooks';

export const USER_KEYS: TableKeyProps[] = [
  { key: 'UserName', value: 'Usuario' },
  { key: 'FirstName', value: 'Nombre' },
  { key: 'Email', value: 'Correo' },
  { key: 'Status', value: 'Estatus' },
];

const UserListScreen = () => {
  const [deleteModal, setDeleteModal] = useState({ id: 0, show: false });
  const [userModal, setUserModal] = useState({ user: null, show: false });
  const { users, isLoadingUsers, refreshUsers } = useGetUsersService();

  const {
    state: queriesState,
    onChangeState,
  } = useOnChangeState<UserRequestProp>();

  const {
    deleteUser,
    errors: deleteErrors,
    isUserDeleting,
  } = useDeleteUserService();

  const loadPagination = useCallback(({ limit, offset }: ServiceParams) => {
    refreshUsers({ limit, offset, queries: { ...queriesState } });
  }, [queriesState]);

  const {
    handleOnChangeInterperPage,
    handleOnNext,
    handleOnPrev,
    itemPerPage,
    page,
  } = usePaginationValues(loadPagination);

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    if (isLoadingUsers) {
      return;
    }

    event.preventDefault();

    refreshUsers({ limit: itemPerPage, offset: page, queries: { ...queriesState } });
  }, [itemPerPage, page, queriesState]);

  const handleDeleteUser = useCallback((id: string) => {
    if (isUserDeleting) {
      return;
    }

    const action = async () => {
      const response = await deleteUser(id);

      if (response.isValid) {
        setDeleteModal({ id: 0, show: false });
        refreshUsers({ limit: itemPerPage, offset: page, queries: { ...queriesState } });
      }
    };

    action();
  }, [isUserDeleting, itemPerPage, page, queriesState]);

  return (
    <>
      <UserCreateUpdateModal
        visible={userModal.show}
        onClose={() => setUserModal({ user: null, show: false })}
        onRefreshUser={() => refreshUsers()}
      />

      <Container fluid>
        <h1>Usuarios</h1>

        <Card className="m-b-8">
          <Card.Header>
            Filtros
          </Card.Header>

          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Correo</Form.Label>

                    <Form.Control
                      name="Email"
                      onChange={onChangeState}
                      placeholder="ejemplo@gmail.com"
                      type="text"
                      value={queriesState?.Email}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Nombre de usuairo</Form.Label>

                    <Form.Control
                      name="UserName"
                      onChange={onChangeState}
                      placeholder=""
                      type="text"
                      value={queriesState?.UserName}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Primer nombre</Form.Label>

                    <Form.Control
                      name="FirstName"
                      onChange={onChangeState}
                      placeholder=""
                      type="text"
                      value={queriesState?.FirstName}

                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Estatus</Form.Label>

                    <Form.Select
                      defaultValue={-1}
                      name="IsActive"
                      onChange={onChangeState}
                    >
                      <option value={-1}>Todos</option>

                      <option value={1}>Activos</option>

                      <option value={0}>Inactivos</option>
                    </Form.Select>
                  </Form.Group></Col>
              </Row>

              <div className="d-flex justify-content-end p-v-8">
                <Button className="d-flex" variant="outline-primary" type="submit">
                  <MaterialIcon icon="search" />

                  Buscar</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <span>Resultados</span>
              </Col>

              <Col className="justify-content-end d-flex">
                <Button
                  onClick={() => setUserModal({ user: null, show: true })}
                  variant="outline-primary d-flex"
                >
                  <i className="material-icons">
                    add
                  </i>

                  Nuevo usuario</Button>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body>
            <Table
              isLoading={isLoadingUsers}
              keys={USER_KEYS}
              onViewItem="/user"
              onDeleteItem={(item: AccountsGetResponse) => setDeleteModal({ id: item.Id, show: true })}
              onEditItem="/user"
              itemPerPage={itemPerPage}
              onChangeItemPerPage={handleOnChangeInterperPage}
              onNextPage={handleOnNext}
              onPrevPage={handleOnPrev}
              page={page}
              showPagination
              canNext={users.length >= itemPerPage}
              values={users}
            />
          </Card.Body>
        </Card>

        <DeleteBasicModal
          id={deleteModal.id}
          show={deleteModal.show}
          onHide={() => setDeleteModal({ id: 0, show: false })}
          onConfirm={(id: string) => handleDeleteUser(id)}
          title="Eliminiar usuario"
          yesButton="Confirmar"
          isLoading={isUserDeleting}
        >
          {deleteErrors && (
            <Alert variant="danger" className="m-v-8">
              {deleteErrors}
            </Alert>
          )}
        </DeleteBasicModal>
      </Container>
    </>
  );
};

export { UserListScreen };
