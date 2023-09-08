import { LatLngTuple } from 'leaflet';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Container, Col, Row, Form, Button } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { AccountsGetResponse, UserGetResponse } from '../../../models';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { useGetUsersService } from '../../../services/useUserService';
import { MaterialIcon } from '../../common/icons/MaterialIcon';
import { EditAssingToUser } from './EditAssingToUser';

interface Props {
  account: AccountsGetResponse | null;
}

function onChange() {
  //doNoting
}

export const AccountDetails: React.FC<Props> = ({ account }) => {
  const [position, setPosition] = useState({ lat: 23.2117084, lng: -106.4108626 });
  const [center, setCenter] = useState<LatLngTuple>([23.2117084, -106.4108626]);
  const [userModeEdit, setUserModeEdit] = useState(false);
  const [assignedUser, setAssignetUser] = useState<UserGetResponse | null>(null);
  const map = React.useRef(null);

  const store = useAppSelector(({ users }) => users);
  const { users } = store;

  const { isLoadingUsers, refreshUsers } = useGetUsersService(false);

  const userAssinged = useMemo(() => {
    if (assignedUser) {
      return assignedUser;
    }

    if (!account?.Assigned2UserId || isLoadingUsers) {
      return null;
    }

    return users.find((user) => user.Id === account?.Assigned2UserId);
  }, [account, assignedUser, users]);

  const toggleUserModeEdit = useCallback(() => {
    setUserModeEdit(prev => !prev);
  }, []);

  const updateAccount = useCallback((userId: number) => {
    const assigned = users.find((item: UserGetResponse) => item.Id === userId);

    if (!assigned) {
      return;
    }

    setAssignetUser(assigned);
    setUserModeEdit(false);
  }, [users]);

  useEffect(() => {
    if (users.length > 0) {
      return;
    }

    refreshUsers();
  }, []);

  useEffect(() => {
    if (!account?.Latitud || !account?.Longitud) {
      return;
    }

    const accountPosition = { lat: account?.Latitud, lng: account?.Longitud };
    setPosition(accountPosition);
    map.current?.flyTo(accountPosition);
    setCenter([account?.Latitud, account?.Longitud]);
  }, [account, map]);

  return (
    <Container>
      <Card className={`m-b-8 ${(!userAssinged) ? 'card-error' : ''}`}>
        <Card.Header as="div" className="d-flex justify-content-between">
          <h5>Gestor de cuenta</h5>

          {userModeEdit
            ? (
              <Button className="d-flex" variant="outline-secondary" onClick={toggleUserModeEdit}>
                <MaterialIcon icon="close" />
              </Button>
            )
            : (
              <Button className="d-flex" variant="outline-success" onClick={toggleUserModeEdit}>
                <MaterialIcon icon="mode_edit" />
              </Button>
            )}
        </Card.Header>

        <Card.Body>
          <div>
            <fieldset disabled>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre/s</Form.Label>

                    <Form.Control
                      name="FirstName"
                      onChange={onChange}
                      readOnly
                      type="text"
                      value={userAssinged?.FirstName}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido paterno</Form.Label>

                    <Form.Control
                      name="MiddleName"
                      onChange={onChange}
                      readOnly
                      type="text"
                      value={userAssinged?.MiddleName}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido paterno</Form.Label>

                    <Form.Control
                      name="LastName"
                      onChange={onChange}
                      readOnly
                      type="text"
                      value={userAssinged?.LastName}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>
          </div>
        </Card.Body>
      </Card>

      <EditAssingToUser
        account={account}
        modeEdit={userModeEdit}
        onUpdateAccount={updateAccount}
        userAssinged={userAssinged}
        users={users}
      />

      <Card>
        <Card.Header as="h5">Detalle</Card.Header>

        <Card.Body>
          <div>
            <Form onSubmit={(event) => event.preventDefault()}>
              <fieldset disabled>
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número d ecuenta</Form.Label>

                      <Form.Control
                        name="AccountNumber"
                        onChange={onChange}
                        readOnly
                        type="text"
                        value={account?.AccountNumber}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre/s</Form.Label>

                      <Form.Control
                        name="FirstName"
                        onChange={onChange}
                        readOnly
                        type="text"
                        value={account?.FirstName}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido paterno</Form.Label>

                      <Form.Control
                        name="MiddleName"
                        onChange={onChange}
                        readOnly
                        type="text"
                        value={account?.MiddleName}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido paterno</Form.Label>

                      <Form.Control
                        name="LastName"
                        onChange={onChange}
                        readOnly
                        type="text"
                        value={account?.LastName}
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
                        readOnly
                        type="email"
                        value={account?.Email}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>

                      <Form.Control
                        name="Mobile"
                        onChange={onChange}
                        readOnly
                        type="number"
                        value={account?.Mobile}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono de casa</Form.Label>

                      <Form.Control
                        name="Phone"
                        onChange={onChange}
                        readOnly
                        type="number"
                        value={account?.Phone}
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
                        readOnly
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
                        readOnly
                        type="text"
                        value={account?.NotificationLocation}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  {/* <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Calle</Form.Label>

                      <Form.Control
                        name="Street"
                        onChange={onChange}
                        readOnly
                        type="text"
                        value={account?.Street}
                      />
                    </Form.Group>
                  </Col> */}

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Código postal</Form.Label>

                      <Form.Control
                        name="PostalCode"
                        onChange={onChange}
                        readOnly
                        type="number"
                        value={account?.PostalCode}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>

                      <Form.Control
                        name="State"
                        readOnly
                        onChange={onChange}
                        value={account?.State}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad</Form.Label>

                      <Form.Control
                        name="City"
                        readOnly
                        onChange={onChange}
                        value={account?.City}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Monto deuda</Form.Label>

                      <Form.Control
                        min={10}
                        name="Amount"
                        onChange={onChange}
                        readOnly
                        type="number"
                        value={account?.Amount}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Latitud</Form.Label>

                      <Form.Control
                        name="Latitud"
                        type="number"
                        readOnly
                        value={account?.Latitud}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Longitud</Form.Label>

                      <Form.Control
                        name="Longitud"
                        type="number"
                        readOnly
                        value={account?.Longitud}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </fieldset>
            </Form>
          </div>

          <div>
            <MapContainer
              ref={map}
              className="m-v-16"
              style={{ height: '300px', width: '100%' }}
              center={center}
              zoom={16}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={position}>
                <Popup>
                  {`${position}`}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
