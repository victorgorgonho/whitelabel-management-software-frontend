import React from 'react';
import { Drawer, PagePath, FormStudent } from '../../components';
import { useStyles } from '../../services/material-ui';

const RegisterStudent: React.FC = () => {
  const classes = useStyles();

  return (
    <div className="container-dash">
      <Drawer />
      <main className={classes.content}>
        <PagePath />
        <FormStudent />
      </main>
    </div>
  );
};

export default RegisterStudent;
