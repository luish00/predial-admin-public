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
import { MaterialIcon } from '../common/icons/MaterialIcon';

import { AccountsGetResponse } from '../../models';
import { useDeleteTaskService, useGetListTasksService } from '../../services/useTaskService';
import {
  ServiceParams,
  usePaginationValues,
} from '../../hooks/usePaginationValues';

export const TASK_KEYS: TableKeyProps[] = [
  { key: 'AccountId', value: 'Id de cuenta' },
  { key: 'Email', value: 'Correo' },
  { key: 'Mobile', value: 'Teléfono' },
  { key: 'AccountNumber', value: 'Cuenta' },
  { key: 'PaymentPromise', value: 'Promesa pago' },
  { key: 'TypeNotification', value: 'Tipo notificacion' },
  { key: 'ContactName', value: 'Nombre de contacto' },
  { key: 'CreatedDate', value: 'Creada' },
];

const TaskListScreen = () => {
  const [deleteModal, setDeleteModal] = useState({ id: 0, show: false });
  const { getTasks, totalTask, isLoadingTask, lastTasks } = useGetListTasksService();

  const loadPagination = useCallback(({ limit, offset }: ServiceParams) => {
    getTasks({ limit, offset });
  }, []);

  const {
    handleOnChangeInterperPage,
    handleOnNext,
    handleOnPrev,
    itemPerPage,
    page,
  } = usePaginationValues(loadPagination);

  const {
    deleteTask,
    errors: tasksErrors,
    isTaskeleting,
  } = useDeleteTaskService();

  const handleDeleteTask = useCallback((id: string) => {
    if (isLoadingTask) {
      return;
    }

    const action = async () => {
      const response = await deleteTask(id);

      if (response.isValid) {
        setDeleteModal({ id: 0, show: false });
        getTasks({ limit: itemPerPage, offset: page });
      }
    };

    action();
  }, [isLoadingTask, page, itemPerPage]);

  return (
    <>
      <Container fluid>
        <h1>Tareas recientes</h1>

        <Card className="m-b-8">
          <Card.Header>
            Filtros
          </Card.Header>

          <Card.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Notificación</Form.Label>

                    <Form.Select>
                      <option value={-1} selected>Todas</option>

                      <option value={1}>Personal</option>

                      <option value={0}>Instructivo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Promesa de pago</Form.Label>

                    <Form.Control type="date" />
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
          <Card.Header>
            <Row className="align-items-center">
              <span>{`Resultados: ${lastTasks.length} de ${totalTask}`}</span>
            </Row>
          </Card.Header>

          <Card.Body>
            <Table
              canNext={((page + 1) * itemPerPage) < totalTask}
              isLoading={isLoadingTask}
              itemPerPage={itemPerPage}
              keys={TASK_KEYS}
              onChangeItemPerPage={handleOnChangeInterperPage}
              onDeleteItem={(item: AccountsGetResponse) => setDeleteModal({ id: item.Id, show: true })}
              onNextPage={handleOnNext}
              onPrevPage={handleOnPrev}
              onViewItem="/task"
              page={page}
              showPagination
              values={lastTasks}
            />
          </Card.Body>
        </Card>

        <DeleteBasicModal
          id={deleteModal.id}
          show={deleteModal.show}
          onHide={() => setDeleteModal({ id: 0, show: false })}
          onConfirm={(id: string) => handleDeleteTask(id)}
          title="Eliminiar Tarea"
          yesButton="Confirmar"
          isLoading={isLoadingTask}
        >
          {tasksErrors && (
            <Alert variant="danger" className="m-v-8">
              {tasksErrors}
            </Alert>
          )}
        </DeleteBasicModal>
      </Container>
    </>
  );
};

export { TaskListScreen };
