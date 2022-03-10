import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Home, Access, RegisterStudent, EditStudent, Payment } from '..';
import { PrivateRoute } from '../_PrivateRoute';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/login" component={Access} />
      <PrivateRoute exact path="/home/:option" component={Home} />
      <PrivateRoute
        exact
        path="/home/alunos/cadastrar"
        component={RegisterStudent}
      />
      <PrivateRoute
        exact
        path="/home/alunos/editar/:id"
        component={EditStudent}
      />
      <PrivateRoute
        exact
        path="/home/alunos/pagamentos/:id"
        component={Payment}
      />
      <Redirect from="/" to="/home/dashboard" />
      <Redirect from="*" to="/" />
    </Switch>
  );
}
