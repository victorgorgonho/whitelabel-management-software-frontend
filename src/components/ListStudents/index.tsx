/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import './styles.scss';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User } from '../../store/ducks/user/types';
import { ReactComponent as ViewIcon } from '../../images/view-icon.svg';
import { ReactComponent as PayIcon } from '../../images/pay-icon.svg';
import { ReactComponent as EditIcon } from '../../images/edit-icon.svg';
import { ReactComponent as InactiveIcon } from '../../images/inactive-icon.svg';
import { ReactComponent as ActiveIcon } from '../../images/confirm-payment-icon.svg';
import { DetailsStudentModal, SavedUserModal } from '..';
import api from '../../services/api';
import { environment } from '../../environment/environment';

interface Props {
  students: User[];
  getStudents(): any;
}

const ListStudents: React.FC<Props> = (props: Props) => {
  const { students, getStudents } = props;
  const token = localStorage.getItem(
    environment.REACT_APP_LOCAL_STORAGE_USER_AUTH,
  );
  const history = useHistory();
  const [showDetailsModal, setShowModalDetails] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<User>();
  const [showModalSuccess, setShowModalSuccess] = useState(false);

  const openModal = (selectedStudent: User) => {
    setCurrentStudent(selectedStudent);
    setShowModalDetails(true);
  };

  const changeSituation = (student: User) => {
    api
      .put(
        `/users/${student.id}`,
        student.isActive
          ? {
              ...student,
              isActive: false,
              startDatePayment: !student.startDatePayment
                ? undefined
                : String(student.startDatePayment),
            }
          : {
              ...student,
              isActive: true,
              startDatePayment: !student.startDatePayment
                ? undefined
                : String(student.startDatePayment),
            },
        {
          headers: { Authorization: token },
        },
      )
      .then(response => {
        setShowModalSuccess(true);
        setTimeout(() => {
          getStudents();
        }, 1500);
      })
      .catch(error => {
        toast.error(`${error.response.data.message}`);
      });
  };

  const renderTableStudents = (
    <>
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Responsável</th>
          <th>Nome do Aluno</th>
          <th>Data de Matrícula</th>
          <th>Pagamento</th>
          <th>Situação</th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr className="table-item" key={student.id}>
            <td> {student.registration} </td>
            <td> {student.parent_name} </td>
            <td> {student.name} </td>
            <td>
              {' '}
              {format(parseISO(student.createdAt as string), 'dd/MM/yyyy')}{' '}
            </td>
            <td className={student.isCompliant ? 'compliant' : 'defaulting'}>
              {' '}
              {student.isCompliant ? 'Adimplente' : 'Inadimplente'}{' '}
            </td>
            <td className={student.isActive ? 'active' : 'inactive'}>
              {' '}
              {student.isActive ? 'Ativo' : 'Ausente'}{' '}
            </td>
            <td className="container-buttons">
              <OverlayTrigger
                overlay={<Tooltip id="edit-student">Editar aluno</Tooltip>}
              >
                <a
                  className="hover-black"
                  onClick={() =>
                    history.push(`/home/alunos/editar/${student.id}`)
                  }
                >
                  <EditIcon />
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={<Tooltip id="view-student">Visualizar aluno</Tooltip>}
              >
                <a className="view-button" onClick={() => openModal(student)}>
                  <ViewIcon />
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={
                  <Tooltip id="payment-student">Pagamentos e cobranças</Tooltip>
                }
              >
                <a
                  className="pay-button"
                  onClick={() =>
                    history.push(`/home/alunos/pagamentos/${student.id}`)
                  }
                >
                  <PayIcon />
                </a>
              </OverlayTrigger>
              {student.isActive ? (
                <OverlayTrigger
                  overlay={
                    <Tooltip id="desactive-student">Desativar aluno</Tooltip>
                  }
                >
                  <a
                    className="hover-red"
                    onClick={() => changeSituation(student)}
                  >
                    <InactiveIcon />
                  </a>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  overlay={<Tooltip id="active-student">Ativar aluno</Tooltip>}
                >
                  <a
                    className="pay-button"
                    onClick={() => changeSituation(student)}
                  >
                    <ActiveIcon />
                  </a>
                </OverlayTrigger>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );

  return (
    <div className="container-list-students">
      {students.length && (
        <Table className="fade-in" responsive size="lg">
          {renderTableStudents}
        </Table>
      )}
      {currentStudent && (
        <DetailsStudentModal
          show={showDetailsModal}
          onHide={() => setShowModalDetails(false)}
          student={currentStudent}
        />
      )}
      <SavedUserModal
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
      />
    </div>
  );
};

export default ListStudents;
