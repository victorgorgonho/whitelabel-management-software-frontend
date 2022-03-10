import React from 'react';
import { useHistory } from 'react-router-dom';
import { useStyles } from '../../services/material-ui';
import {
  Drawer,
  Dashboard,
  Reports,
  Students,
  Settings,
  PagePath,
} from '../../components';

const Home: React.FC = () => {
  const history = useHistory();
  const actualRoute = window.location.pathname.substring(1).split('/')[1];
  const classes = useStyles();

  const RenderContentPage = () => {
    switch (actualRoute) {
      case 'dashboard':
        return (
          <>
            <PagePath />
            <Dashboard />
          </>
        );
      case 'relatorios':
        return (
          <>
            <PagePath pathName="relatórios" />
            <Reports />
          </>
        );
      case 'alunos':
        return (
          <>
            <PagePath />
            <Students />
          </>
        );
      case 'configuracoes':
        return (
          <>
            <PagePath pathName="configurações" />
            <Settings />
          </>
        );
      default:
        history.push('/home/dashboard');
        return <h5>Rota inexistente</h5>;
    }
  };

  return (
    <div className="container-dash">
      <Drawer />
      <main className={classes.content}>
        <RenderContentPage />
      </main>
    </div>
  );
};

export default Home;
