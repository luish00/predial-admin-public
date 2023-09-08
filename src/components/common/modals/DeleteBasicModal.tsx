import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';

interface Props {
  body?: string;
  children?: React.ReactNode;
  id: number | string;
  isLoading?: boolean;
  noButton?: string;
  onCancel?: () => void;
  onConfirm: (_: string) => void;
  onHide: () => void;
  show: boolean;
  title?: string;
  yesButton: string;
}

export const DeleteBasicModal: React.FC<Props> = ({
  body = '¿Estas seguro?',
  children,
  isLoading,
  id,
  noButton,
  onCancel,
  onConfirm,
  onHide,
  show,
  title = 'Eliminiar',
  yesButton = 'Eliminiar',
}) => {
  const handleOnYes = React.useCallback(() => {
    onConfirm && onConfirm(String(id));
  }, [id]);

  const handleHide = React.useCallback(() => {
    if (isLoading) {
      return;
    }

    onHide();
  }, [isLoading, onHide]);

  return (
    <Modal show={show} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {body}
        {children}
      </Modal.Body>

      <Modal.Footer>
        {noButton && (
          <Button variant="secondary" onClick={onCancel}>
            {noButton}
          </Button>
        )}

        <Button disabled={isLoading} variant="danger" onClick={handleOnYes}>
          {isLoading
            ? <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true" /><span className="visually-hidden">Cargando...</span>
            </>
            : <>
              {yesButton}
            </>
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
};