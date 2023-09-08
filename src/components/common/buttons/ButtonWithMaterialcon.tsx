import React from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';

interface Props extends ButtonProps {
  icon: string;
  text: string;
  isLoading?: boolean;
}

export const ButtonWithMaterialcon: React.FC<Props> = ({
  icon = '',
  text = '',
  isLoading = false,
  ...rest
}) => (
  <Button disabled={isLoading} variant="outline-primary d-flex m-r-8" {...rest}>
    <>
      <i className="material-icons p-r-8">
        {icon}
      </i>

      {isLoading
        ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              className="d-flex align-self-center"
              aria-hidden="true" />

            <span className="visually-hidden">Cargando...</span>
          </>
        )
        : <>{text}</>}
    </>
  </Button>
);
