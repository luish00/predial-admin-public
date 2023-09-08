import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';

export interface CarouselImageProp {
  img: string;
  subTitle?: string;
  title?: string;
}

interface Props {
  images: CarouselImageProp[];
  onClose: () => void;
  selectedIndex?: number;
  show: boolean;
}

export const CarouselModal: React.FC<Props> = ({
  images,
  onClose,
  selectedIndex,
  show,
}) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    if (selectedIndex === undefined || selectedIndex === -2) {
      return;
    }

    setIndex(selectedIndex);
  }, [selectedIndex]);

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Imagenes</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Carousel activeIndex={index} onSelect={handleSelect}>
            {images.map((item: CarouselImageProp, index) => (
              <Carousel.Item key={String(index)}>
                <img
                  className="d-block w-100"
                  src={item.img}
                  alt={`imagen número ${index}`}
                />

                <Carousel.Caption>
                  <h3>{item.title}</h3>
                  <p>{item.subTitle}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
