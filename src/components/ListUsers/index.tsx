/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './styles.scss';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { ReactComponent as EditIcon } from '../../images/edit-icon.svg';
import { ReactComponent as TrashIcon } from '../../images/trash-icon.svg';
import { User } from '../../store/ducks/user/types';

interface Props {
  users: User[];
  userSelected(user: User): any;
  idUserDelete(id: string | undefined): any;
}

const ListUsers: React.FC<Props> = (props: Props) => {
  const { users, userSelected, idUserDelete } = props;

  const renderPaginationListUsers = (
    <>
      <thead>
        <tr>
          <th>Id</th>
          <th>Nome do Usuário</th>
          <th>E-mail</th>
          <th>Data de Cadastro</th>
        </tr>
      </thead>
      <tbody id="admin-list">
        {users.map(user => (
          <tr className="table-item" key={user.id}>
            <td> {user.id} </td>
            <td> {user.name} </td>
            <td> {user.email} </td>
            <td>
              {' '}
              {format(parseISO(user.createdAt as string), 'dd/MM/yyyy')}{' '}
            </td>
            <td className="container-edit-delete">
              <OverlayTrigger
                overlay={<Tooltip id="edit-user">Editar usuário</Tooltip>}
              >
                <a
                  id="edit-button"
                  className="edit-button"
                  onClick={() => userSelected(user)}
                >
                  <EditIcon />
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={<Tooltip id="delete-user">Excluir usuário</Tooltip>}
              >
                <a
                  id="delete-button"
                  className="delete-button"
                  onClick={() => idUserDelete(user.id)}
                >
                  <TrashIcon />
                </a>
              </OverlayTrigger>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );

  return (
    <div className="container-list-users">
      <Table className="fade-in" responsive size="lg">
        {renderPaginationListUsers}
      </Table>
    </div>
  );
};

export default ListUsers;
