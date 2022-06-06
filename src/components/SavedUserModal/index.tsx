/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import './styles.scss';
import { Modal } from 'react-bootstrap';
import { ReactComponent as SuccessIcon } from '../../images/success-green.svg';

interface Props {
  show: boolean;
  onHide(): any;
}

const SavedUserModal: React.FC<Props> = (props: Props) => {
  const { show, onHide } = props;

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        onHide();
      }, 1500);
    }
  }, [show, onHide]);

  return (
    <Modal
      {...props}
      id="modal-success-user"
      centered
      className="modal-success-user"
    >
      <SuccessIcon />
      <h3>Salvo com Sucesso</h3>
    </Modal>
  );
};

export default SavedUserModal;
