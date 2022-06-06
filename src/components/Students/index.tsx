import React, { useState, useEffect, useCallback } from 'react';
import './styles.scss';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from '@material-ui/core';
import {
  Row,
  Form,
  Col,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ReactComponent as RegisterIcon } from '../../images/register-icon.svg';
import { ReactComponent as ClearIcon } from '../../images/clear-icon.svg';
import { ReactComponent as OrderIcon } from '../../images/order-icon.svg';
import SearchIcon from '../../images/search-icon.svg';
import { User } from '../../store/ducks/user/types';
import api from '../../services/api';
import { ListStudents, Pagination } from '..';
import { removeSpecialChars } from '../../services/mask';

const STUDENTS_PER_PAGE = 9;
const MARGIN_BOTTOM = 10;

const Students: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem(
    String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
  );
  const [filterType, setFilterType] = useState(location.state);
  const [students, setStudents] = useState<User[]>();
  const [allStudents, setAllStudents] = useState<User[]>();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [isAlphabetically, setIsAlphabetically] = useState(false);

  const filterByType = useCallback(
    (users: User[]) => {
      if (filterType !== '') {
        switch (filterType) {
          case 'compliants':
            setStudents(users?.filter(student => student.isCompliant === true));
            break;
          case 'defaulting':
            setStudents(
              users?.filter(student => student.isCompliant === false),
            );
            break;
          case 'actives':
            setStudents(users?.filter(student => student.isActive === true));
            break;
          case 'inactives':
            setStudents(users?.filter(student => student.isActive === false));
            break;
          default:
            break;
        }
      }
    },
    [filterType],
  );

  const filtering = (nameOrRegistration: string) => {
    setFilter(nameOrRegistration);
    if (nameOrRegistration !== '') {
      setStudents(
        students?.filter(
          student =>
            removeSpecialChars(student.parent_name as string).indexOf(
              removeSpecialChars(nameOrRegistration),
            ) !== -1 ||
            student.registration?.indexOf(nameOrRegistration) !== -1,
        ),
      );
    } else if (filterType) {
      filterByType(allStudents as User[]);
    } else {
      setStudents(allStudents);
    }
  };

  const filterByAlphabetically = () => {
    if (!isAlphabetically) {
      const arrayAllStudents: User[] = JSON.parse(JSON.stringify(allStudents));
      const arrayFiltered = arrayAllStudents.sort((a, b) => {
        if (
          (a.parent_name?.toLowerCase() as string) <
          (b.parent_name?.toLowerCase() as string)
        ) {
          return -1;
        }
        if (
          (a.parent_name?.toLowerCase() as string) >
          (b.parent_name?.toLowerCase() as string)
        ) {
          return 1;
        }
        return 0;
      });
      setStudents(arrayFiltered);
    } else {
      setStudents(allStudents);
      setFilter('');
    }
    setIsAlphabetically(!isAlphabetically);
  };

  const getAllStudents = useCallback(() => {
    setLoading(true);
    api
      .get('users/search?user_type=student', {
        headers: { Authorization: token },
      })
      .then(response => {
        setLoading(false);
        setAllStudents(response.data.users);
        if (filterType) {
          filterByType(response.data.users);
        } else {
          setStudents(response.data.users);
        }
      })
      .catch(error => {
        setLoading(false);
        toast.error(`${error.response.data.message}`);
      });
  }, [token, filterByType, filterType]);

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  const clearFilters = () => {
    setStudents(allStudents);
    setFilter('');
    setFilterType('');
  };

  const indexOfLastStudent = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirstStudent = indexOfLastStudent - STUDENTS_PER_PAGE;
  const currentStudents =
    students && students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderHeader = (
    <Row noGutters>
      <div className="input-container">
        <img src={SearchIcon} alt="search-icon" />
        <Form.Control
          id="search-input"
          placeholder="Buscar Nome do Responsável ou Matrícula..."
          className="form-white search"
          value={filter}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            filtering(event.target.value)
          }
        />
      </div>
      <OverlayTrigger overlay={<Tooltip id="clear">Limpar filtros</Tooltip>}>
        <Button
          id="clear-filters"
          className="white-button clear"
          onClick={clearFilters}
          style={{ marginBottom: MARGIN_BOTTOM }}
        >
          <ClearIcon />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={<Tooltip id="order">Filtrar por ordem alfabética</Tooltip>}
      >
        <Button
          id="order-by-alphabet"
          className={
            isAlphabetically
              ? 'white-button order active'
              : 'white-button order'
          }
          onClick={filterByAlphabetically}
          style={{ marginBottom: MARGIN_BOTTOM }}
        >
          <OrderIcon />
        </Button>
      </OverlayTrigger>
      <Button
        id="create-student"
        className="white-button left"
        onClick={() => history.push('/home/alunos/cadastrar')}
        style={{ marginBottom: MARGIN_BOTTOM }}
      >
        <RegisterIcon />
        Cadastrar Aluno
      </Button>
    </Row>
  );

  return (
    <div className="container-students">
      {!loading ? (
        <Col className="container-table">
          {renderHeader}
          <Row noGutters className="mt-3">
            <h3>Lista de Alunos</h3>
          </Row>
          {currentStudents?.length ? (
            <>
              <Row noGutters style={{ minHeight: '65vh' }}>
                {currentStudents && (
                  <ListStudents
                    students={currentStudents as User[]}
                    getStudents={getAllStudents}
                  />
                )}
              </Row>
              <Col>
                <Pagination
                  totalPosts={students?.length as number}
                  postsPerPage={STUDENTS_PER_PAGE}
                  paginate={paginate}
                />
              </Col>
            </>
          ) : (
            <h3 className="mt-4 mb-4">Aluno não encontrado</h3>
          )}
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
    </div>
  );
};

export default Students;
