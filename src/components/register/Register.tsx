import React, { useCallback, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';

import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import { ContainerCard } from '../common/containers/ContainerCard';
import { LoadingButton } from '../common/buttons/LoadingButton';

import './Register.css';

interface IFormValues {
  confirmPassword: string;
  password: string;
  username: string;
}

const Register: React.FC = () => {
  const initialValues: IFormValues = { confirmPassword: '', password: '', username: '',  };
  const [error, setError] = useState<string>('');

  const handleSubmit = useCallback((values: IFormValues, actions: FormikHelpers<IFormValues>) => {
    // WIP
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
  });

  const ErrorMessage: React.FC = () => {
    if (formik.isSubmitting) {
      return null;
    }

    return (
      <span className="Error-message d-flex text-center w-100">
        {error}
      </span>
    );
  };

  return (
    <Container className="d-flex flex-column justify-content-center h-100 w-50">
      <ContainerCard>
        <span>Registrate</span>

        <Form className="w-50" onSubmit={formik.handleSubmit}>
          <Form.Group className="form-outline mb-4" controlId="Username">
            <Form.Label className="d-flex justify-content-start">Correo</Form.Label>
            <Form.Control
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Ingresa tu correo"
              required
              type="email"
              value={formik.values.username}
            />
          </Form.Group>

          <Form.Group className="form-outline mb-4" controlId="Password">
            <Form.Label className="d-flex justify-content-start">Contraseña</Form.Label>
            <Form.Control
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Ingresa tu contraseña"
              required
              type="password"
              value={formik.values.password}
            />
          </Form.Group>

          <Form.Group className="form-outline mb-4" controlId="ConfirmPassword">
            <Form.Label className="d-flex justify-content-start">Confirmar Contraseña</Form.Label>
            <Form.Control
              name="confirmPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Confirma tu contraseña"
              required
              type="password"
              value={formik.values.confirmPassword}
            />
          </Form.Group>

          <LoadingButton isLoading={formik.isSubmitting}>
            Registrar
          </LoadingButton>

          <ErrorMessage />

          <div className="text-center">
            <p>Tienes cuenta? <a href="/login">Inicia sesión</a></p>
          </div>
        </Form>
      </ContainerCard>
    </Container>
  );
};

export { Register };
