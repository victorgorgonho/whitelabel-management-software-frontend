/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import './styles.scss';
import { Modal, Row, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ReactComponent as SuccessIcon } from '../../images/success-red.svg';
import api from '../../services/api';
import { environment } from '../../environment/environment';

interface Props {
  onHide(): any;
  show: boolean;
  id?: string;
  successDelete(): any;
}

const DeleteUserModal: React.FC<Props> = (props: Props) => {
  const { id, onHide, successDelete } = props;
  const token = localStorage.getItem(
    environment.REACT_APP_LOCAL_STORAGE_USER_AUTH,
  );
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);

  const deleteUser = () => {
    api
      .delete(`users/${id}`, { headers: { Authorization: token } })
      .then(response => {
        setIsSuccessDelete(true);
        successDelete();
        setTimeout(() => {
          onHide();
          setIsSuccessDelete(false);
        }, 2000);
      })
      .catch(error => {
        toast.error(`${error.response.data.message}`);
      });
  };

  return (
    <Modal {...props} className="modal-confirm" centered>
      {!isSuccessDelete ? (
        <>
          <h3>
            Tem Certeza que Deseja <br /> Excluir o Usuário?
          </h3>
          <Row noGutters className="container-buttons">
            <Button className="tertiary-button" onClick={onHide}>
              Não
            </Button>
            <Button className="secundary-button" onClick={deleteUser}>
              Sim
            </Button>
          </Row>
        </>
      ) : (
        <div className="container-success">
          <SuccessIcon />
          <h3>Excluído com Sucesso</h3>
        </div>
      )}
    </Modal>
  );
};

export default DeleteUserModal;