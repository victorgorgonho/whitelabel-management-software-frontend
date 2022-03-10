import React from 'react';
import { Drawer, PagePath, PaymentStudent } from '../../components';
import { useStyles } from '../../services/material-ui';

const Payment: React.FC = () => {
  const classes = useStyles();

  return (
    <div className="container-dash">
      <Drawer />
      <main className={classes.content}>
        <PagePath />
        <PaymentStudent />
      </main>
    </div>
  );
};

export default Payment;
