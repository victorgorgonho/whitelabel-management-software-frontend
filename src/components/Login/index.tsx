import React, { useState, useEffect } from 'react';
import './styles.scss';
import { Form, Container, Spinner, Col, Row } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { login } from '../../store/ducks/auth/actions';
import { environment } from '../../environment/environment';

import WhitelabelLogo from '../../images/logo/logo-whitelabel.png';
import EmailIcon from '../../images/email-icon.svg';
import PasswordIcon from '../../images/password-icon.svg';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpando token
  useEffect(() => {
    localStorage.removeItem(environment.REACT_APP_LOCAL_STORAGE_USER_AUTH);
    localStorage.removeItem(environment.REACT_APP_LOCAL_STORAGE_USER_ID);
  }, []);

  // eslint-disable-next-line consistent-return
  const singIn = (event: React.FormEvent) => {
    event.preventDefault();

    if (email === '' || password === '')
      return toast.error('Preencha todos os campos');

    setLoading(true);
    api
      .post('users/authenticate', { email, password })
      .then(response => {
        const { token, user } = response.data;

        localStorage.setItem(
          environment.REACT_APP_LOCAL_STORAGE_USER_AUTH,
          token,
        );
        localStorage.setItem(
          environment.REACT_APP_LOCAL_STORAGE_USER_ID,
          user.id,
        );
        dispatch(login());
        setLoading(false);
        history.push('/home/dashboard');
      })
      .catch(error => {
        setLoading(false);
        toast.error(`${error.response.data.message}`);
      });
  };

  const formSignIn = (
    <Form onSubmit={(event: React.FormEvent) => singIn(event)}>
      <div className="input-container">
        <img src={EmailIcon} alt="email-icon" />
        <Form.Control
          id="username"
          placeholder="E-mail"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />
      </div>
      <div className="input-container">
        <img src={PasswordIcon} alt="password-icon" />
        <Form.Control
          id="password"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        />
      </div>
      <Button id="login-button" type="submit" className="primary-button">
        {!loading ? (
          'Acessar'
        ) : (
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
          />
        )}
      </Button>
    </Form>
  );

  return (
    <Container fluid className="container-login">
      <Row>
        <Col className="container-form" xl={6}>
          <img src={WhitelabelLogo} alt="logo" className="logo-admin" />
          {formSignIn}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
