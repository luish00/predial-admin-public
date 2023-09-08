import React from 'react';
import Button from 'react-bootstrap/Button';

interface Props {
  children: React.ReactNode;
  isLoading: boolean;
}

const LoadingButton: React.FC<Props> = ({
  children = '',
  isLoading = false,
}) => {
  function renderContent() {
    if (isLoading) {
      return <div className="spinner-border text-light" role="status" />;
    }

    return children;
  }

  return (
    <Button
      className="btn mb-4 d-flex justify-content-center w-100"
      variant="primary"
      type="submit"
    >
      {renderContent()}
    </Button>
  );
};

export { LoadingButton };
