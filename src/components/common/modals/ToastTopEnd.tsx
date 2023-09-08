import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { MaterialIcon } from '../icons/MaterialIcon';

type ToastType = 'success' | 'danger' | 'info' | 'warning' | 'primary' | 'dark';

interface Props {
  onClose?: () => void;
  show: boolean;
  delay?: number;
  title: string;
  subTitle?: string;
  autohide?: boolean;
  type?: ToastType;
  createAt?: string;
}

const ICONS = {
  success: 'done',
  info: 'info',
  warning: 'warning',
  danger: 'report_problem',
  primary: 'priority_high',
  dark: 'dark_mode'
};

export const ToastTopEnd: React.FC<Props> = ({
  autohide = false,
  createAt = 'Justo ahora',
  delay = 3000,
  onClose,
  show,
  subTitle,
  title,
  type = 'info',
}) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="position-relative"
    >
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={onClose}
          show={show}
          delay={delay}
          className={`border border-${type}`}
          autohide={autohide}
        >
          <Toast.Header>
           <MaterialIcon clazz={`text-${type}`} icon={`${ICONS[type]}`}/>

            <strong className={`me-auto text-${type}`}>{title}</strong>

            <small className="text-muted">{createAt}</small>
          </Toast.Header>

          <Toast.Body>{subTitle}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};
