import React, { useCallback, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { tryLog } from '../../../utils/utilities';
import { UploadAccountContent } from "./UploadAccountContent";

interface Props {
  onHide: () => void;
  show: boolean;
}

export const AccountInportModal: React.FC<Props> = ({ onHide, show }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dataHeader, setDataHeader] = useState<string[]>([]);
  const [dataRaw, setDataRaw] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    event.preventDefault();


    if (files && files[0]) {
      setCsvFile(files[0]);
    }
  }, []);

  const csvFileToArray = (string: string) => {
    if (!string) {
      return;
    }

    const csvHeader = string.replace(/"/g, '').slice(0, string
      .indexOf("\n")).split(",")
      .map(item => item.trim().replace(/ /g, '_'));
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((item, index) => {
      const values = item.replace(/"/g, '').replace(/(\d+),(\d)/g, '$1$2').split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index] && values[index].replace('$', '').trim();

        return object;
      }, {});

      return obj;
    });

    setDataHeader(csvHeader);
    setDataRaw(array);
  };

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reader = new FileReader();

    if (csvFile) {
      try {
        reader.onload = function (eventFile) {
          if (!eventFile?.target) {
            return;
          }

          const text = eventFile.target.result;

          if (text) {
            csvFileToArray(String(text));
          }
        };

        reader.readAsText(csvFile);
      } catch ({ message }) {
        tryLog({ key: 'Read csv', message: String(message) });
      }
    }
  }, [csvFile]);

  const handleHide = useCallback(() => {
    setCsvFile(null);
    setDataRaw([]);
    setDataHeader([]);
    setDisabled(false);

    onHide();
  }, [onHide]);

  return (
    <Modal
      aria-labelledby="contained-modal-import-csv"
      backdrop="static"
      centered
      onHide={handleHide}
      show={show}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title as="h4" id="contained-modal-import-csv">
          Importar cuentas desde CSV
        </Modal.Title>
      </Modal.Header>


      <Modal.Body>
        <Container>
          <Form onSubmit={onSubmit}>
            <fieldset disabled={disabled}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Archivo de cuentas</Form.Label>

                    <Form.Control
                      accept=".csv"
                      onChange={onChange}
                      required
                      type="file"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex mt-3 justify-content-end">
                <Button
                  disabled={!csvFile}
                  className="m-t-16"
                  type="submit"
                  variant="outline-primary">
                  Cargar
                </Button>
              </div>
            </fieldset>
          </Form>

          <UploadAccountContent
            onUploadAccount={(disabled: boolean) => setDisabled(disabled)}
            dataHeader={dataHeader}
            dataRaw={dataRaw}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
};
