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
import { AccountsGetResponse } from '../../models';
import { MaterialIcon } from '../common/icons/MaterialIcon';
import { ServiceParams, usePaginationValues } from '../../hooks/usePaginationValues';
import { AccountNewEditModal } from './AccountNewEditModal';
import { AccountDetailsProp } from '../../types';
import { ButtonWithMaterialcon } from '../common/buttons';
import { convertToCSV } from '../../utils/utilities';
import { AccountAssignUserModal } from './AccountAssignUserModal';
import { CardHeaderWithButton } from '../common/card';
import { useDeleteAccountService, useGetAccounts } from '../../services';
import { useOnChangeState } from '../../hooks';
import { AccountInportModal } from './modalInport/AccountInportModal';

export const ACCOUNT_KEYS: TableKeyProps[] = [
  { key: 'Id', value: 'Id' },
  { key: 'AccountNumber', value: 'Núm. Cuenta' },
  { key: 'FullName', value: 'Usuario' },
  // { key: 'FullAddress', value: 'Dirección' },
  { key: 'Street', value: 'Dir. del predio' },
  { key: 'NotificationLocation', value: 'Dir. de notificación' },
  { key: 'UserName', value: 'Gestor asig.' },
];

const AccountListScreen = () => {
  const [deleteModal, setDeleteModal] = useState({ id: 0, show: false });
  const [newEditModal, setNewEditModal] = useState({ accountToEdit: null, id: 0, show: false });
  const [selectedRows, setSeletedRows] = useState<string[]>([]);
  const [showAssignModal, setAssignModal] = useState(false);
  const [importShowModal, setImportShowModal] = useState(false);

  const { accounts, isLoadingAccount, totalAccount, getAccounts } = useGetAccounts();
  const {
    isdDeleteingAccount,
    deleteAccount,
    errors: deleteErrors,
  } = useDeleteAccountService();
  const {
    onChangeState,
    state: queryState,
  } = useOnChangeState<AccountDetailsProp>();

  const onCloseNewEditModal = useCallback(() => {
    setNewEditModal({ accountToEdit: null, id: 0, show: false });
  }, []);

  const onEditAccount = useCallback((item: AccountDetailsProp) => {
    if (!item || !item?.Id) {
      return;
    }

    setNewEditModal({
      accountToEdit: item,
      id: item.Id,
      show: true,
    });
  }, []);

  const handleAssignManager = useCallback(() => {
    setAssignModal(true);
  }, []);

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

  const refreshAccount = useCallback(() => {
    loadPagination({ limit: itemPerPage, offset: page, queries: { ...queryState } });
  }, [page, itemPerPage, queryState]);

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    getAccounts({
      limit: itemPerPage,
      offset: page,
      queries: { ...queryState },
    });
  }, [itemPerPage, page, queryState]);

  const onDeleteAccount = useCallback((accountId = '') => {
    if (isdDeleteingAccount || !accountId) {
      return;
    }

    const action = async () => {
      const response = await deleteAccount(accountId);

      if (response.isValid) {
        refreshAccount();
        setDeleteModal({ id: 0, show: false });
      }
    };

    action();
  }, [isdDeleteingAccount, refreshAccount]);

  return (
    <>
      <Container fluid>
        <h1>Cuentas</h1>

        <Card className="m-b-8">
          <Card.Header>
            Filtros
          </Card.Header>

          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Núm. de cuenta</Form.Label>

                    <Form.Control
                      name="AccountNumber"
                      onChange={onChangeState}
                      placeholder=""
                      type="text"
                      value={queryState.AccountNumber}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>

                    <Form.Control
                      name="NotificationLocation"
                      onChange={onChangeState}
                      placeholder=""
                      type="text"
                      value={queryState.NotificationLocation}
                    />
                  </Form.Group>
                </Col>

                {/* <Col>
                  <Form.Group>
                    <Form.Label>Códio postal</Form.Label>

                    <Form.Control
                      name="PostalCode"
                      onChange={onChangeState}
                      placeholder=""
                      type="number"
                      value={queryState.PostalCode}
                    />
                  </Form.Group>
                </Col> */}

                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Estatus</Form.Label>

                    <Form.Select name="Status" onChange={onChangeState} defaultValue={0}>
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
          <CardHeaderWithButton title="Resultados">
            <ButtonWithMaterialcon
              icon="attach_file"
              onClick={() => setImportShowModal(true)}
              text="Importar csv"
            />

            <ButtonWithMaterialcon
              icon="file_download"
              onClick={() => convertToCSV(accounts, 'cuentas')}
              text="Exportar a csv"
            />

            {selectedRows.length > 0 && (
              <ButtonWithMaterialcon
                icon="person_add"
                onClick={handleAssignManager}
                text="Asignar cuentas"
              />
            )}


            <ButtonWithMaterialcon
              icon="add"
              onClick={() => setNewEditModal({ accountToEdit: null, id: 0, show: true })}
              text="Agregar cuenta"
            />
          </CardHeaderWithButton>

          <Card.Body>
            <Table
              canNext={((page + 1) * itemPerPage) < totalAccount}
              isLoading={isLoadingAccount}
              itemPerPage={itemPerPage}
              keys={ACCOUNT_KEYS}
              onChangeItemPerPage={handleOnChangeInterperPage}
              onDeleteItem={(item: AccountsGetResponse) => setDeleteModal({ id: item.Id || 0, show: true })}
              onEditItem={onEditAccount}
              onNextPage={handleOnNext}
              onPrevPage={handleOnPrev}
              onSelectedRow={setSeletedRows}
              onViewItem="/account"
              page={page}
              selectedRows={selectedRows}
              showPagination
              values={accounts}
            />
          </Card.Body>
        </Card>

        <DeleteBasicModal
          id={deleteModal.id}
          show={deleteModal.show}
          onHide={() => setDeleteModal({ id: 0, show: false })}
          onConfirm={(id: string) => onDeleteAccount(id)}
          title="Eliminiar cuenta"
          yesButton="Confirmar"
          isLoading={isdDeleteingAccount}
        >
          {deleteErrors && (
            <Alert variant="danger" className="m-v-8">
              {deleteErrors}
            </Alert>
          )}
        </DeleteBasicModal>

        <AccountNewEditModal
          accountToEdit={newEditModal.accountToEdit}
          id={newEditModal.id}
          onAccountRefresh={refreshAccount}
          onHide={onCloseNewEditModal}
          show={newEditModal.show}
        />

        <AccountAssignUserModal
          show={showAssignModal}
          accountsId={selectedRows}
          onUpdatedAccount={refreshAccount}
          onHide={() => setAssignModal(false)}
        />

        <AccountInportModal show={importShowModal} onHide={() => setImportShowModal(false)} />
      </Container>
    </>
  );
};

export { AccountListScreen };
