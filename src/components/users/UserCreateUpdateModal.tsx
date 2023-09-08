import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { UserGetResponse, UserRequestProp } from '../../models';
import { useCreateUpdateUserSerivce } from '../../services';
import { ToastTopEnd } from '../common/modals/ToastTopEnd';

interface Props {
  user?: UserGetResponse;
  visible: boolean;
  onClose: () => void;
  onRefreshUser: () => void;
}

const newUser: UserRequestProp = {
  Address: '',
  Email: '',
  FirstName: '',
  IsActive: false,
  LastName: '',
  MiddleName: '',
  Mobile: '',
  Phone: '',
  UserName: ''
};

export const UserCreateUpdateModal: React.FC<Props> = ({
  user,
  onClose,
  onRefreshUser,
  visible,
}) => {
  const [userRequest, setUserRequest] = useState<UserRequestProp>(newUser);
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const formRef = useRef(null);

  const {
    createUser,
    errors,
    isCreatingUser,
    resetUserService,
    updateUser,
    userCreated,
  } = useCreateUpdateUserSerivce();

  const isLoading = useMemo(() => (
    isCreatingUser
  ), [isCreatingUser]);

  const handleClose = useCallback(() => {
    if (isLoading) {
      return;
    }

    setValidated(false);
    resetUserService();
    formRef.current?.reset();

    onClose();
  }, [formRef, isLoading, onClose]);

  const onChange: React.ChangeEventHandler<any> = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      const { target } = event;

      setUserRequest((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    },
    [],
  );

  const onSubmit = useCallback((event: React.ChangeEvent<HTMLFormElement>) => {
    if (isLoading) {
      return;
    }

    setValidated(true);
    event.preventDefault();


    if (!formRef.current?.checkValidity()) {
      event.stopPropagation();

      return;
    }

    createUser(userRequest);
  }, [isLoading, userRequest]);

  useEffect(() => {
    if (!visible || !user || !user?.Id) {
      return;
    }

    setUserRequest({
      Address: user.Address,
      Email: user.Email || '',
      FirstName: user.FirstName,
      Id: user.Id,
      IsActive: user.IsActive,
      LastName: user.LastName || '',
      MiddleName: user.MiddleName || '',
      Mobile: user.Mobile || '',
      Phone: user.Phone || '',
      UserName: user.UserName,
    });
  }, [user, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (userCreated) {
      setShowToast(true);
      onRefreshUser();
      handleClose();
    }
  }, [userCreated, visible]);

  return (
    <>
      <ToastTopEnd
        autohide
        onClose={() => setShowToast(false)}
        show={showToast}
        subTitle={user ? 'Usuario actualizado' : 'Usuario creado'}
        title="Completado"
        type="success"
      />

      <Container>
        <Modal
          aria-labelledby="modal-assign-manager"
          backdrop="static"
          centered
          onHide={handleClose}
          show={visible}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Crear gestor</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={onSubmit} validated={validated} ref={formRef}>
              <fieldset disabled={isLoading}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Nombre/s</Form.Label>

                      <Form.Control
                        name="FirstName"
                        onChange={onChange}
                        required
                        type="text"
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Apellido materno</Form.Label>

                      <Form.Control
                        name="MiddleName"
                        onChange={onChange}
                        required
                        type="text"
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Apellido paterno</Form.Label>

                      <Form.Control
                        name="LastName"
                        onChange={onChange}
                        required
                        type="text"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Usuario</Form.Label>

                      <Form.Control
                        name="UserName"
                        onChange={onChange}
                        required
                        type="email"
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Dirección</Form.Label>

                      <Form.Control
                        name="Address"
                        onChange={onChange}
                        required
                        type="text"
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Teléfono</Form.Label>

                      <Form.Control
                        name="Phone"
                        onChange={onChange}
                        required
                        min={1000000000}
                        max={10000000000}
                        type="number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Movil</Form.Label>

                      <Form.Control
                        name="Mobile"
                        onChange={onChange}
                        required
                        min={1000000000}
                        max={10000000000}
                        type="number"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Correo</Form.Label>

                      <Form.Control
                        name="Email"
                        onChange={onChange}
                        required
                        type="email"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {errors && <Alert variant="danger" className="m-v-16">{errors}</Alert>}

                <Modal.Footer className="m-t-8">
                  <Button onClick={handleClose} variant="outline-seconday">
                    Cerrar
                  </Button>

                  <Button
                    disabled={isLoading}
                    type="submit"
                    variant="outline-primary"
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true" /><span className="visually-hidden">Cargando...</span>
                      </>
                    )
                      : 'Crear'}
                  </Button>
                </Modal.Footer>
              </fieldset>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};
