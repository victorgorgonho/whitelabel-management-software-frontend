/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
import './styles.scss';
import { Row, Col, Form, Container, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Pagination,
  ListUsers,
  DeleteUserModal,
  SavedUserModal,
} from '../index';
import { ReactComponent as RegisterIcon } from '../../images/register-icon.svg';
import { ReactComponent as EditIcon } from '../../images/edit-icon.svg';
import SearchIcon from '../../images/search-icon.svg';
import api from '../../services/api';
import { User } from '../../store/ducks/user/types';
import { ApplicationState } from '../../store';
import { validateEmail } from '../../services/validation';
import { removeSpecialChars } from '../../services/mask';

const Settings: React.FC = () => {
  const userLogin = useSelector((state: ApplicationState) => state.user.user);
  const token = localStorage.getItem(
    String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
  );
  const [users, setUsers] = useState<User[]>();
  const [usersBackup, setUsersBackup] = useState<User[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [idUserDelete, setIdUserDelete] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [filter, setFilter] = useState('');
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    email: '',
    name: '',
    password: '',
    user_type: '',
  });

  const filtering = (name: string) => {
    setFilter(name);

    if (filter !== '') {
      setUsers(
        usersBackup?.filter(
          user =>
            removeSpecialChars(user.name).indexOf(removeSpecialChars(name)) !==
            -1,
        ),
      );
    } else {
      setUsers(usersBackup);
    }
  };

  const getUsers = useCallback(() => {
    setLoading(true);
    api
      .get('users', { headers: { Authorization: token } })
      .then(response => {
        setUsers(
          response.data.users.filter(
            (user: User) => user.user_type !== 'student',
          ),
        );
        setUsersBackup(
          response.data.users.filter(
            (user: User) => user.user_type !== 'student',
          ),
        );
        setLoading(false);
        setCurrentPage(1);
      })
      .catch(error => {
        toast.error(`${error.response.data.message}`);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users && users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const setUpdateUser = (user?: User | undefined) => {
    setIsUpdating(true);
    if (user) {
      setCurrentUser({
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        password: '',
      });
    } else {
      setCurrentUser({
        id: userLogin.id,
        email: userLogin.email,
        name: userLogin.name,
        user_type: userLogin.user_type,
        password: '',
      });
    }
  };

  const setClearUser = () => {
    setIsUpdating(false);
    setCurrentUser({
      id: '',
      email: '',
      name: '',
      password: '',
      user_type: '',
    });
  };

  const creatingUser = () => {
    const { email, name, password, user_type } = currentUser;

    api
      .post('users/register', { email, name, password, user_type })
      .then(response => {
        setShowModalSuccess(true);
        setClearUser();
        setConfirmPassword('');
        getUsers();
      })
      .catch(error => toast.error(`${error.response.data.message}`));
  };

  const editUser = () => {
    api
      .put(
        `users/${currentUser.id}`,
        currentUser.password === ''
          ? { ...currentUser, password: undefined }
          : currentUser,
        {
          headers: { Authorization: token },
        },
      )
      .then(response => {
        setShowModalSuccess(true);
        setClearUser();
        setConfirmPassword('');
        getUsers();
      })
      .catch(error => toast.error(`${error.response.data.message}`));
  };

  const savingUser = (event: React.FormEvent) => {
    event.preventDefault();

    if (currentUser.name !== '' && validateEmail(currentUser.email)) {
      if (confirmPassword !== '' && currentUser.password !== '') {
        if (confirmPassword === currentUser.password) {
          if (!isUpdating) {
            currentUser.user_type = 'admin';
            creatingUser();
          } else {
            editUser();
          }
        } else {
          toast.error('As senhas não coincidem');
        }
      } else if (!isUpdating) {
        currentUser.user_type = 'admin';
        creatingUser();
      } else {
        editUser();
      }
    } else {
      toast.error('Por favor preencha todos os campos obrigatórios');
    }
  };

  const deleteUser = (id: string) => {
    setIdUserDelete(id);
    setShowModalConfirm(true);
  };

  const renderHeader = (
    <Row>
      <Form onSubmit={(event: React.FormEvent) => event.preventDefault()}>
        <div className="input-container">
          <img src={SearchIcon} alt="search-icon" />
          <Form.Control
            placeholder="Buscar Nome..."
            className="form-white search"
            value={filter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              filtering(event.target.value);
            }}
          />
        </div>
      </Form>
      {isUpdating ? (
        <Button className="white-button left" onClick={setClearUser}>
          <RegisterIcon />
          Cadastrar Usuário
        </Button>
      ) : (
        <Button className="white-button left" onClick={() => setUpdateUser()}>
          <EditIcon />
          Editar Usuário
        </Button>
      )}
    </Row>
  );

  return (
    <Container fluid className="container-settings">
      {!loading ? (
        <Col>
          {renderHeader}
          <Row>
            <h3>Lista de Usuários</h3>
          </Row>
          {users?.length ? (
            <>
              <Row style={{ minHeight: '28vh' }}>
                {currentUsers && (
                  <ListUsers
                    users={currentUsers}
                    userSelected={setUpdateUser}
                    idUserDelete={deleteUser}
                  />
                )}
              </Row>
              {users && (
                <Pagination
                  totalPosts={users?.length}
                  postsPerPage={usersPerPage}
                  paginate={paginate}
                />
              )}
            </>
          ) : (
            <h3 className="mt-4 mb-4 pb-4">Usuário não encontrado</h3>
          )}
          <Row>
            {isUpdating ? <h3>Editar Usuário</h3> : <h3>Adicionar Usuário</h3>}
          </Row>
          <Form
            className="form-edit-create-user"
            onSubmit={(event: React.FormEvent) => savingUser(event)}
          >
            <Row>
              <Col>
                <Form.Label>
                  Nome Completo <span>*</span>
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="name"
                  value={currentUser.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentUser({
                      ...currentUser,
                      name: event.target.value,
                    })
                  }
                />
                <Form.Label>
                  {isUpdating ? 'Nova Senha' : 'Senha'} <span>*</span>
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="password"
                  value={currentUser.password}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentUser({
                      ...currentUser,
                      password: event.target.value,
                    })
                  }
                />
              </Col>
              <Col>
                <Form.Label>
                  E-mail <span>*</span>
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="email"
                  value={currentUser.email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentUser({
                      ...currentUser,
                      email: event.target.value,
                    })
                  }
                />
                <Form.Label>
                  {isUpdating ? 'Confirmar Nova Senha' : 'Confirmar Senha'}{' '}
                  <span>*</span>
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="password"
                  value={confirmPassword}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(event.target.value)
                  }
                />
              </Col>
            </Row>
            <Row>
              <Button className="tertiary-button" onClick={setClearUser}>
                Cancelar
              </Button>
              <Button className="secundary-button" type="submit">
                Salvar
              </Button>
            </Row>
          </Form>
        </Col>
      ) : (
        <div className="container-loading">
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
            className="spinner-blue"
          />
        </div>
      )}
      <DeleteUserModal
        show={showModalConfirm}
        onHide={() => setShowModalConfirm(false)}
        id={idUserDelete}
        successDelete={getUsers}
      />
      <SavedUserModal
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
      />
    </Container>
  );
};

export default Settings;
