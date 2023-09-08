import { LatLngLiteral } from 'leaflet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

import { useCreateUpdateAccount } from '../../services/useAccountService';
import { AccountDetailsProp } from '../../types';
import { AccountModalSuccess } from './AccountModalSuccess';
import { useDireccionByCp } from './hooks';

interface Props {
  accountToEdit?: AccountDetailsProp | null;
  id: number | null | undefined;
  onAccountRefresh: () => void;
  onHide: () => void;
  show: boolean;
}

interface MapClickEventProp {
  latlng: LatLngLiteral;
}

interface MarkerProps {
  position: LatLngLiteral | null;
  setPosition: (_: LatLngLiteral) => void;
}

const LocationMarker: React.FC<MarkerProps> = ({ position, setPosition }) => {
  useMapEvents({
    click({ latlng }: MapClickEventProp) {
      setPosition(latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        {`${position}`}
      </Popup>
    </Marker>
  );
};

const newAccount: AccountDetailsProp = {
  Amount: 0,
  City: 'Mazatlán',
  Country: 'México',
  Email: '',
  FirstName: '',
  LastName: '',
  Latitud: 0,
  Longitud: 0,
  MiddleName: '',
  Mobile: '',
  NotificationLocation: '',
  Phone: '',
  PostalCode: '82000',
  State: 'Sinaloa',
  Street: '',
};

export const AccountNewEditModal: React.FC<Props> = ({
  accountToEdit,
  show,
  id,
  onHide,
  onAccountRefresh,
}) => {
  const formRef = useRef(null);
  const [validated, setValidated] = useState(false);
  const [account, setAccount] = useState<AccountDetailsProp>(newAccount);
  const [position, setPosition] = useState<LatLngLiteral | null>(null);

  const {
    cityOptionsByCp,
    stateOptionsByCp,
    towshipOptionsByCp,
  } = useDireccionByCp(account?.PostalCode || '');

  const {
    accountCreated,
    createAccount,
    errors,
    isCreatingAccount,
    resetAccountService,
    updateAccount,
  } = useCreateUpdateAccount();

  const onSubmit = useCallback((event: { preventDefault: () => void; stopPropagation: () => void; }) => {
    event.preventDefault();
    setValidated(true);

    if (!formRef.current?.checkValidity() || isCreatingAccount) {
      event.stopPropagation();

      return;
    }

    const lat = position && position?.lat;
    const lng = position && position?.lng;
    const body: AccountDetailsProp = {
      ...account,
      Latitud: lat || 0,
      Longitud: lng || 0,
    };

    const acction = id ? updateAccount : createAccount;

    acction(body);
  }, [account, createAccount, formRef, id, isCreatingAccount, position]);

  const handleHide = useCallback(() => {
    setValidated(false);
    setAccount(newAccount);
    setPosition({ lat: 0, lng: 0 });
    resetAccountService();

    formRef.current?.reset();

    onHide();
  }, [onHide, formRef]);

  const onCreateAccountSuccess = useCallback(() => {
    onAccountRefresh();
    handleHide();
  }, [handleHide]);

  const onChange: React.ChangeEventHandler<any> = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      const { target } = event;

      setAccount((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    },
    [],
  );

  useEffect(() => {
    if (!accountToEdit) {
      return;
    }

    setAccount(accountToEdit);
    setPosition({ lat: accountToEdit.Latitud || 0, lng: accountToEdit.Longitud || 0 });
  }, [accountToEdit]);

  return (
    <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        onHide={handleHide}
        show={show && !accountCreated}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {id ? 'Editar cuenta' : 'Agregar cuenta'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Form validated={validated} onSubmit={onSubmit} ref={formRef}>
              <fieldset disabled={isCreatingAccount}>
                <Row>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Número d ecuenta</Form.Label>

                      <Form.Control
                        name="AccountNumber"
                        onChange={onChange}
                        required
                        type="text"
                        value={account.AccountNumber}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Nombre/s</Form.Label>

                      <Form.Control
                        name="FirstName"
                        onChange={onChange}
                        required
                        type="text"
                        value={account.FirstName}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Apellido paterno</Form.Label>

                      <Form.Control
                        name="MiddleName"
                        onChange={onChange}
                        required
                        type="text"
                        value={account.MiddleName}
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
                        value={account.LastName}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo</Form.Label>

                      <Form.Control
                        name="Email"
                        onChange={onChange}
                        required
                        type="email"
                        value={account.Email}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>

                      <Form.Control
                        max={10000000000}
                        maxLength={11}
                        min={1000000000}
                        minLength={10}
                        name="Mobile"
                        onChange={onChange}
                        required
                        type="number"
                        value={account.Mobile}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono de casa</Form.Label>

                      <Form.Control
                        max={10000000000}
                        maxLength={11}
                        min={1000000000}
                        minLength={10}
                        name="Phone"
                        onChange={onChange}
                        required
                        type="number"
                        value={account.Phone}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección del predio</Form.Label>

                      <Form.Control
                        name="Street"
                        onChange={onChange}
                        type="text"
                        value={account?.Street}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección de notificación</Form.Label>

                      <Form.Control
                        name="NotificationLocation"
                        onChange={onChange}
                        type="text"
                        value={account?.NotificationLocation}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Monto deuda</Form.Label>

                      <Form.Control
                        min={10}
                        name="Amount"
                        onChange={onChange}
                        required type="number"
                        value={account.Amount}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>C.P., Estado, ciudad</Accordion.Header>
                    <Accordion.Body>



                      <Row>
                        {/* <Col>
                    <Form.Group>
                      <Form.Label>Calle</Form.Label>

                      <Form.Control
                        name="Street"
                        onChange={onChange}
                        required
                        type="text"
                        value={account.Street}
                      />
                    </Form.Group>
                  </Col> */}

                        {/* <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Colonia</Form.Label>

                      <Form.Select name="Town" required onChange={onChange}>
                        <option disabled value="">Selecciona...</option>

                        {towshipOptionsByCp}
                      </Form.Select>
                    </Form.Group>
                  </Col> */}
                      </Row>

                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Código postal</Form.Label>

                            <Form.Control
                              max={100000}
                              maxLength={5}
                              min={10000}
                              name="PostalCode"
                              onChange={onChange}
                              required
                              type="number"
                              value={account.PostalCode}
                            />
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Estado</Form.Label>

                            <Form.Select name="State" required onChange={onChange} value={account.State}>
                              <option disabled value="">Selecciona...</option>

                              {stateOptionsByCp}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Ciudad</Form.Label>

                            <Form.Select name="City" required onChange={onChange} value={account.City}>
                              <option disabled value="">Selecciona...</option>

                              {cityOptionsByCp}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Latitud</Form.Label>

                      <Form.Control name="Latitud" required type="number" readOnly value={position?.lat} />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Longitud</Form.Label>

                      <Form.Control name="Longitud" required type="number" readOnly value={position?.lng} />
                    </Form.Group>
                  </Col>

                  <div>
                    <MapContainer
                      className="m-v-16"
                      style={{ height: '300px', width: '100%' }}
                      center={[23.2117084, -106.4108626]}
                      zoom={13}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  </div>
                </Row>

                {errors && <Alert variant="danger">{errors}</Alert>}

                <Modal.Footer>
                  <Button onClick={handleHide} variant="outline-secondary">Cerrar</Button>

                  <Button onClick={onSubmit} type="submit" variant="outline-success" disabled={isCreatingAccount}>
                    {isCreatingAccount && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}

                    <>
                      {isCreatingAccount
                        ? (<span className="visually-hidden">{id ? 'Actualizando...' : 'Guardardando...'}</span>)
                        : (<span>{id ? 'Actualizar' : 'Guardar'}</span>)}
                    </>
                  </Button>
                </Modal.Footer>
              </fieldset>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>

      <AccountModalSuccess
        accountCreated={accountCreated}
        handleHide={handleHide}
        id={id}
        onCreateAccountSuccess={onCreateAccountSuccess}
      />
    </>
  );
};
