import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Props {
  accountCreated: boolean;
  handleHide: () => void;
  id?: number | null | undefined;
  onCreateAccountSuccess: () => void;
}

export const AccountModalSuccess: React.FC<Props> = ({
  accountCreated,
  handleHide,
  id,
  onCreateAccountSuccess,
}) => (
  <>
    <Modal
      aria-labelledby="modal-success-title"
      onHide={handleHide}
      show={accountCreated}
    >
      <Modal.Header>
        <Modal.Title id="modal-success-title">
          Completado con exito
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {id ? 'Cuenta actualizada' : 'Cuenta Creada'}
      </Modal.Body>

      <Modal.Body>
        <Modal.Footer>
          <Button onClick={onCreateAccountSuccess} variant="outline-success">Aceptar</Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  </>
);
