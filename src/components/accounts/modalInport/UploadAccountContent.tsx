import React, { useCallback, useState } from "react";
import { Accordion, Alert, Button, Col, Form, ProgressBar, Row } from "react-bootstrap";

import { useOnChangeState } from "../../../hooks";
import { AccountRequest } from "../../../models.d";
import { useCreateUpdateAccountCsv } from "../../../services";
import { sleep } from "../../../utils/utilities";

interface Props {
  dataHeader: string[];
  dataRaw: string[];
  onUploadAccount: (_: boolean) => void;
}

interface AccountHeaderType {
  AccountNumber: string;
  Street: string;
  FirstName: string;
  Amount: string;
  NotificationLocation: string;
}

interface AccountUploadResultType {
  id: number;
  accountNumber: string;
  variant: 'success' | 'danger';
}

export const UploadAccountContent: React.FC<Props> = ({
  dataRaw,
  dataHeader,
  onUploadAccount,
}) => {
  const [accountCount, setAccountCount] = useState({
    complete: false,
    index: 0,
    loading: false,
  });
  const [accountResult, setAccountResult] = useState<AccountUploadResultType[]>([]);
  const { onChangeState, state } = useOnChangeState<AccountHeaderType>({
    AccountNumber: 'CLAVE_CATASTRAL',
    Street: 'UBICACION',
    Amount: 'TOTAL',
    FirstName: 'PROPIETARIO',
    NotificationLocation: 'NOTIFICACION',
  });

  const { createAccount } = useCreateUpdateAccountCsv();

  const uploadAccount = async ({ items, index }) => {
    if (items.length === 0) {
      setAccountCount({ complete: true, index, loading: true });
      return;
    }

    const [item, ...rest] = items;

    const result = await createAccount(item);

    setAccountResult(prev => [...prev, {
      id: result.data?.Id || '',
      accountNumber: item.AccountNumber,
      variant: result.isValid ? 'success' : 'danger',
    }]);

    await sleep(100);

    setAccountCount(prev => ({ ...prev, loading: true, index }));
    uploadAccount({ items: rest, index: index + 1 });
  };

  const onSubmitAccount = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accoutToUpload = dataRaw.map(item => {
      const account = new AccountRequest({
        AccountNumber: item[state.AccountNumber],
        Amount: item[state.Amount],
        Street: item[state.Street],
        FirstName: item[state.FirstName],
        NotificationLocation: item[state.NotificationLocation],
        MiddleName: 'na',
        Phone: '1111111111',
        Mobile: '1111111111',
        Email: 'na@na.com'
      });

      return { ...account };
    });

    onUploadAccount(true);
    uploadAccount({ items: accoutToUpload, index: 0 });
  }, [state, dataRaw]);

  if (!dataRaw.length) {
    return <></>;
  }

  return (
    <>
      <h4 className="mb-3">{`Cantidad de registros: ${dataRaw.length}`}</h4>

      <Form onSubmit={onSubmitAccount}>
        <fieldset disabled={accountCount.loading || accountCount.complete}>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Número de cuenta</Form.Label>

                <Form.Select
                  name="AccountNumber"
                  onChange={onChangeState}
                  defaultValue="CLAVE_CATASTRAL"
                  required
                >
                  <option value="">Selecciona..</option>

                  {dataHeader.map((item, index) => (
                    <option key={String(index)} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Propietario</Form.Label>

                <Form.Select
                  name="FirstName"
                  onChange={onChangeState}
                  defaultValue="PROPIETARIO"
                  required
                >
                  <option value="">Selecciona..</option>

                  {dataHeader.map((item, index) => (
                    <option key={String(index)} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Dir. del predio</Form.Label>

                <Form.Select
                  name="Street"
                  onChange={onChangeState} defaultValue="UBICACION"
                  required
                >
                  <option value="">Selecciona..</option>

                  {dataHeader.map((item, index) => (
                    <option key={String(index)} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Dir. de notificación</Form.Label>

                <Form.Select
                  defaultValue="NOTIFICACION"
                  name="NotificationLocation"
                  onChange={onChangeState}
                  required
                >
                  <option value="">Selecciona..</option>

                  {dataHeader.map((item, index) => (
                    <option key={String(index)} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Adeudo</Form.Label>

                <Form.Select
                  defaultValue="TOTAL"
                  name="Amount"
                  onChange={onChangeState}
                  required
                >
                  <option value="">Selecciona..</option>

                  {dataHeader.map((item, index) => (
                    <option key={String(index)} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <ProgressBar animated now={(accountCount.index / dataRaw.length) * 100} />

              <div className="d-flex mt-3 justify-content-end">
                <span>{`${accountCount.index} de ${dataRaw.length}`}</span>
              </div>
            </Col>
          </Row>
        </fieldset>

        <Row className="mt-3">
          {accountResult.length ? (
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Mostrar detalle</Accordion.Header>
                <Accordion.Body>
                  <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    <div>
                      {accountResult.map((item, index) => (
                        <Alert key={String(index)} variant={item.variant}>
                          {`Id: ${item.id || 'N/A'}, Número de cuenta: ${item.accountNumber}`}
                        </Alert>
                      ))}
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ) : <></>}
        </Row>

        <div className="d-flex mt-3 justify-content-end">
          <Button
            disabled={accountCount.loading || accountCount.complete}
            className="m-t-16"
            type="submit"
            variant="outline-primary">
            Surbir cuentas
          </Button>
        </div>
      </Form>
    </>
  );
};
