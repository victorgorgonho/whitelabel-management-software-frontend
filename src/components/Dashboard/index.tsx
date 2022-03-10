/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable prefer-const */
import React, { useEffect, useState, useCallback } from 'react';
import './styles.scss';
import { toast } from 'react-toastify';
import { Row, Spinner, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { environment } from '../../environment/environment';
import { User } from '../../store/ducks/user/types';
import { ListStudents } from '../index';
import { infoStudent } from '../../services/types';

const STUDENTS_PER_PAGE = 8;

const Dashboard: React.FC = () => {
  const token = localStorage.getItem(
    environment.REACT_APP_LOCAL_STORAGE_USER_AUTH,
  );
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<User[]>();
  const [infoStudents, setInfoStudents] = useState<infoStudent[]>([]);
  const [filterStudentsType, setFilterStudentsType] = useState('');
  const [allStudents, setAllStudents] = useState<User[]>();

  const getStudents = useCallback(() => {
    setLoading(true);
    api
      .get('users/search?user_type=student', {
        headers: { Authorization: token },
      })
      .then(response => {
        setLoading(false);
        const res = response.data;
        const tempArray = [];
        tempArray.push(
          {
            name: 'compliants',
            title: 'Adimplentes',
            value: res.compliants,
          },
          {
            name: 'defaulting',
            title: 'Inadimplentes',
            value: res.defaulting,
          },
          {
            name: 'actives',
            title: 'Ativos',
            value: res.actives,
          },
          {
            name: 'inactives',
            title: 'Ausentes',
            value: res.inactives,
          },
        );
        setInfoStudents(tempArray);
        setStudents(res.users.slice(0, STUDENTS_PER_PAGE));
        setAllStudents(res.users);
      })
      .catch(error => {
        toast.error(`${error.response.data.message}`);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  const filterStudents = (type: string) => {
    if (type === filterStudentsType && allStudents) {
      setFilterStudentsType('');
      setStudents(allStudents.slice(0, STUDENTS_PER_PAGE));
    } else {
      setFilterStudentsType(type);
      switch (type) {
        case 'compliants':
          setStudents(
            allStudents
              ?.filter(student => student.isCompliant === true)
              .slice(0, STUDENTS_PER_PAGE),
          );
          break;
        case 'defaulting':
          setStudents(
            allStudents
              ?.filter(student => student.isCompliant === false)
              .slice(0, STUDENTS_PER_PAGE),
          );
          break;
        case 'actives':
          setStudents(
            allStudents
              ?.filter(student => student.isActive === true)
              .slice(0, STUDENTS_PER_PAGE),
          );
          break;
        case 'inactives':
          setStudents(
            allStudents
              ?.filter(student => student.isActive === false)
              .slice(0, STUDENTS_PER_PAGE),
          );
          break;
        default:
          break;
      }
    }
  };

  const renderButtonsInfoUsers = (
    <Row noGutters className="container-render-buttons">
      {infoStudents.map(item => (
        <Button
          key={item.name}
          className={
            filterStudentsType === item.name
              ? `button-info-students ${item.name}`
              : 'button-info-students'
          }
          onClick={() => filterStudents(item.name)}
        >
          <div className="wrapper-info">
            <h1 className={item.name}>{item.value}</h1>
            <div>
              Alunos <br />
              <b>{item.title}</b>
            </div>
          </div>
        </Button>
      ))}
    </Row>
  );

  return (
    <Container fluid className="container-dashboard">
      {!loading ? (
        <>
          <Row>{renderButtonsInfoUsers}</Row>
          {students?.length !== 0 ? (
            <>
              <Row>
                <h3>Últimas Matrículas</h3>
              </Row>
              <Row>
                {students && (
                  <ListStudents students={students} getStudents={getStudents} />
                )}
              </Row>
              <Row>
                <Link
                  to={{ pathname: '/home/alunos', state: filterStudentsType }}
                >
                  {' '}
                  Visualizar Todas Matrículas{' '}
                </Link>
              </Row>
            </>
          ) : (
            <h3>Alunos não encontrados</h3>
          )}
        </>
      ) : (
        <Container fluid className="container-spinner">
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
            className="spinner-blue"
          />
        </Container>
      )}
    </Container>
  );
};

export default Dashboard;
