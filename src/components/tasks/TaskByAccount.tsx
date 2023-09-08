import React, { useCallback, useState } from 'react';
import { Alert, Card, Container } from 'react-bootstrap';
import { TaskGetResponse } from '../../models';
import { useDeleteTaskService, useGetTaskService } from '../../services/useTaskService';
import { DeleteBasicModal } from '../common/modals';
import { Table, TableKeyProps } from '../common/tables/Table';

interface Props {
  accountId: string;
}

const KEYS: TableKeyProps[] = [
  { key: 'Email', value: 'Correo' },
  { key: 'Mobile', value: 'Teléfono' },
  { key: 'PaymentPromise', value: 'Promesa pago' },
  { key: 'TypeNotification', value: 'Tipo notificacion' },
  { key: 'CreatedDate', value: 'Creación' },
];

export const TaskByAccount: React.FC<Props> = ({ accountId }) => {
  const { data, isLoading, getTasks } = useGetTaskService(accountId);
  const [deleteModal, setDeleteModal] = useState({ id: 0, show: false });

  const {
    deleteTask,
    errors: tasksErrors,
    isTaskeleting,
  } = useDeleteTaskService();

  const handleDeleteTask = useCallback((id: string) => {
    if (isTaskeleting) {
      return;
    }

    const action = async () => {
      const response = await deleteTask(id);

      if (response.isValid) {
        setDeleteModal({ id: 0, show: false });
        getTasks();
      }
    };

    action();
  }, [isTaskeleting]);


  return (
    <>
      <Container>
        <Card>
          <Card.Header as="h5">
            Lista de tareas
          </Card.Header>

          <Card.Body>
            <Table
              isLoading={isLoading}
              keys={KEYS}
              onDeleteItem={(item: TaskGetResponse) => setDeleteModal({ id: item.Id, show: true })}
              onViewItem="/task"
              values={data}
            />
          </Card.Body>
        </Card>
      </Container>

      <DeleteBasicModal
        id={deleteModal.id}
        show={deleteModal.show}
        onHide={() => setDeleteModal({ id: 0, show: false })}
        onConfirm={(id: string) => handleDeleteTask(id)}
        title="Eliminiar Tarea"
        yesButton="Confirmar"
        isLoading={isTaskeleting}
      >
        {tasksErrors && (
          <Alert variant="danger" className="m-v-8">
            {tasksErrors}
          </Alert>
        )}
      </DeleteBasicModal>
    </>
  );
};
