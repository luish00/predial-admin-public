import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetTaskOneService, useGetListAttService } from '../../services';
import { AttachmentProp } from '../../types';
import { CarouselImageProp, CarouselModal } from '../common/modals';
import { TASK_KEYS } from './TaskListScreen';

export const TaskViewScreen: React.FC = () => {
  const { id } = useParams<string>();
  const [showModalAttch, setModalAttach] = useState({ show: false, selectedIndex: -1 });

  const {
    data,
    isLoading,
  } = useGetTaskOneService(id || '');

  const { attachements, getAttachmentByAccount, isLoadingAttch }
    = useGetListAttService();

  const taskMemo = useMemo(() => {
    if (!data) {
      return null;
    }

    return data;
  }, [data]);


  const imagesModal: CarouselImageProp[] = useMemo(() => {
    if (isLoadingAttch || attachements.length === 0) {
      return [];
    }

    const data: CarouselImageProp[] = attachements.map((item: AttachmentProp) => ({
      img: item.Body,
      title: item.Type,
      subTitle: item.Name
    }));

    return data;
  }, [attachements, isLoadingAttch]);

  useEffect(() => {
    if (!taskMemo?.AccountId) {
      return;
    }

    getAttachmentByAccount(taskMemo?.AccountId);
  }, [taskMemo?.AccountId]);

  return (
    <>
      <CarouselModal
        images={imagesModal}
        onClose={() => setModalAttach({ show: false, selectedIndex: -1 })}
        selectedIndex={showModalAttch.selectedIndex}
        show={showModalAttch.show}
      />

      <Container fluid>
        <Row>
          <Col md={3} className="p-b-8">
            <Card>
              <Card.Header as="h5">Detalle de la tarea</Card.Header>

              <Card.Body>
                <Card.Title>{`Resumen ${isLoading ? 'Cargando...' : ''}`}</Card.Title>

                <div>
                  {TASK_KEYS.map(item => (
                    <div key={item.key}>
                      <strong>{`${item.value}: `}</strong>
                      <span>{taskMemo && taskMemo[item.key]}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Card>
              <Card.Header as="h5">{`Imagenes ${isLoadingAttch ? 'Cargando...' : ''}`}</Card.Header>

              <Card.Body>
                <Card.Title></Card.Title>

                <Row>
                  {attachements?.map((item: AttachmentProp, index: number) => (
                    <Col key={String(index)} md={3}>
                      <Card
                        aria-role="button"
                        className="btn"
                        onClick={() => setModalAttach({ show: true, selectedIndex: index })}
                      >
                        <Card.Img
                          variant="top"
                          src={item.Body}
                        />

                        <Card.Body>
                          <Card.Title>{item.Type}</Card.Title>

                          <Card.Text>
                            {item.Name}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}

                  {!isLoadingAttch && attachements.length === 0 && (
                    <Alert variant="info">
                      Sin imagenes
                    </Alert>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
