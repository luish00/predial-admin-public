import React, { useCallback } from 'react';
import { useLoginService } from '../../services/useAuthService';
import { FormikHelpers, useFormik } from 'formik';

import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';

import { LoadingButton } from '../common/buttons/LoadingButton';
import { ContainerCard } from '../common/containers/ContainerCard';

import './Login.css';

interface IFormValues {
  password: string;
  username: string;
}

const Login:React.FC = () => {
  const { errorLogin, doLogin } = useLoginService();
  const initialValues: IFormValues = { password: '', username: '' };

  const handleSubmit = useCallback((values: IFormValues, actions: FormikHelpers<IFormValues>) => {
    actions.setSubmitting(true);

    doLogin({ Password: values.password, UserName: values.username }).then(() => {
      actions.setSubmitting(false);
    });
  }, [doLogin]);


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
        {errorLogin}
      </span>
    );
  };

  return (
    <Container className="d-flex flex-column justify-content-center h-100 w-50">
      <ContainerCard>
        <span>Inicia Sesión</span>

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

          <LoadingButton isLoading={formik.isSubmitting}>
            Iniciar Sesión
          </LoadingButton>

          <ErrorMessage />

          {/* <div className="text-center">
            <p>No tienes cuenta? <a href="/register">Regístrate</a></p>
          </div> */}
        </Form>
      </ContainerCard>
    </Container>
  );
};

export { Login };
