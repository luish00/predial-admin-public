import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ServiceParams, usePaginationValues } from "../../hooks/usePaginationValues";
import { UserGetResponse, UserRequestProp } from "../../models";

import { useUpdatAssignUserService, useCreateUpdateAccount, useCreateUpdateUserSerivce, useGetAccounts, useUsertByIdService } from "../../services";
import { ButtonWithMaterialcon } from "../common/buttons";
import { CardHeaderWithButton } from "../common/card";
import { MaterialIcon } from "../common/icons/MaterialIcon";
import { ToastTopEnd } from "../common/modals/ToastTopEnd";

import { Shimmer } from '../common/shimmer';
import { Table, TableKeyProps } from "../common/tables/Table";

import { USER_KEYS } from './UserListScreen';

export const ACCOUNT_KEYS: TableKeyProps[] = [
  { key: 'AccountNumber', value: 'Núm. Cuenta' },
  { key: 'City', value: 'Ciudad' },
  { key: 'State', value: 'Estado' },
  { key: 'PostalCode', value: 'C.P.' },
  { key: 'UserName', value: 'Gestor asig.' },
];

export const UserViewScreen = () => {
  const { id } = useParams();
  const [selectedRows, setSeletedRows] = useState<string[]>([]);
  const [showToast, setShowToast] = useState({ visible: false, message: '' });
  const [userDetails, setUserDetails] = useState<UserGetResponse | null>(null);
  const [statusUser, setStatusUser] = useState(false);

  const { accounts, isLoadingAccount, totalAccount, getAccounts } = useGetAccounts();
  const { getUser, isLoadingGetUser, user } = useUsertByIdService(id);

  const loadPagination = useCallback(({ limit, offset }: ServiceParams) => {
    getAccounts({ limit, offset });
  }, []);

  const {
    handleOnChangeInterperPage,
    handleOnNext,
    handleOnPrev,
    itemPerPage,
    page,
  } = usePaginationValues(loadPagination);

  const {
    errors: accountsError,
    isLoading: isAssingLoading,
    isAcountUpdated,
    updatAssignUser,
    resetAssignService,
  } = useUpdatAssignUserService();

  const { errors: userError, updateUser, isUserUpdated } = useCreateUpdateUserSerivce();

  const isLoading = useMemo(() => {
    return isAcountUpdated || isAssingLoading || isLoadingAccount || isLoadingGetUser;
  }, [isAcountUpdated, isAssingLoading, isLoadingAccount, isLoadingGetUser]);

  const onSubmitFilter = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  const onUpdateStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event;

    if (!user) {
      return;
    }

    const body: UserRequestProp = {
      ...user,
      IsActive: Boolean(checked),
    } as UserRequestProp;

    setStatusUser(checked);
    updateUser(body);
  }, [user]);

  const toastError = useMemo(() => (accountsError, userError), [accountsError, userError]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!isAcountUpdated) {
      return;
    }

    setShowToast({ visible: true, message: 'assingnación de cuentas' });
    resetAssignService();
    loadPagination({ limit: itemPerPage, offset: page });
    setSeletedRows([]);
  }, [isAcountUpdated]);

  useEffect(() => {
    if (!isUserUpdated || !user) {
      return;
    }

    const newStatus: UserGetResponse = {
      ...user,
      IsActive: statusUser,
    };

    setShowToast({ visible: true, message: 'Cambio de estatus actulizado' });
    setUserDetails(newStatus);
    resetAssignService();
  }, [isUserUpdated, statusUser, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setStatusUser(user.IsActive);
    setUserDetails(user);
  }, [user]);

  return (
    <Container fluid>
      <ToastTopEnd
        autohide
        onClose={() => setShowToast({ visible: false, message: '' })}
        show={showToast.visible}
        subTitle={showToast.message}
        title="Usuarios"
        type={toastError ? 'danger' : 'success'}
      />

      <Row>
        <Col md={3} className="p-b-8">
          <Card>
            <Card.Header as="div">
              <Row>
                <Col md={12} xl={10}>
                  <Card.Title as="h5">Detalle del gestor</Card.Title>
                </Col>

                <Col md={12} xl={2}>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label=""
                      onChange={onUpdateStatus}
                      checked={statusUser}
                    />
                  </Form>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              <Card.Title>{`Resumen ${isLoadingGetUser ? 'cargando...' : ''}`}</Card.Title>

              <div>
                {USER_KEYS.map(item => (
                  <Shimmer key={item.key} visible={isLoadingGetUser} height="24px">
                    <strong>{`${item.value}: `}</strong>
                    <span>{userDetails && userDetails[item.key]}</span>
                  </Shimmer>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card className="m-b-8">
            <Card.Header>
              Filtros
            </Card.Header>

            <Card.Body>
              <Form onSubmit={onSubmitFilter}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control placeholder="" type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Estado</Form.Label>
                      <Form.Control placeholder="" type="text" />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Códio postal</Form.Label>
                      <Form.Control placeholder="" type="number" maxLength={5} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Estatus</Form.Label>
                      <Form.Select>
                        <option value={0}>Todas</option>
                        <option value={1}>Asignadas</option>
                        <option value={2}>Sin asignar</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
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
            <CardHeaderWithButton title="Cuentas">
              {selectedRows.length > 0 && (
                <ButtonWithMaterialcon
                  isLoading={isLoading}
                  icon="person_add"
                  onClick={() => user?.Id
                    && updatAssignUser({ UserId: String(user.Id), AccountIds: selectedRows })}
                  text="Asignar gestor"
                />
              )}
            </CardHeaderWithButton>

            <Card.Body>
              <Table
                canNext={((page + 1) * itemPerPage) < totalAccount}
                isLoading={isLoadingAccount}
                itemPerPage={itemPerPage}
                keys={ACCOUNT_KEYS}
                onChangeItemPerPage={handleOnChangeInterperPage}
                onNextPage={handleOnNext}
                onPrevPage={handleOnPrev}
                onSelectedRow={setSeletedRows}
                page={page}
                selectedRows={selectedRows}
                showPagination={!isLoading}
                values={accounts}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
