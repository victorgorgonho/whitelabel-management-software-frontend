/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import './styles.scss';
import {
  List,
  ListItem,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
} from '@material-ui/core';
import DrawerMaterial from '@material-ui/core/Drawer';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { environment } from '../../environment/environment';
import { useStyles } from '../../services/material-ui';
import { removeSpecialChars } from '../../services/mask';
import { logout } from '../../store/ducks/auth/actions';
import { updateUser } from '../../store/ducks/user/action';
import { ApplicationState } from '../../store';
import api from '../../services/api';

import WhitelabelLogo from '../../images/logo/logo-whitelabel.png';
import DashboardIcon from '../../images/dashboard-icon.svg';
import ReportIcon from '../../images/report-icon.svg';
import StudentsIcon from '../../images/students-icon.svg';
import ConfigIcon from '../../images/config-icon.svg';
import LogoutIcon from '../../images/logout-icon.svg';

interface ListItem {
  name: string;
  icon: any;
}

export const Drawer: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const id = localStorage.getItem(environment.REACT_APP_LOCAL_STORAGE_USER_ID);
  const token = localStorage.getItem(
    environment.REACT_APP_LOCAL_STORAGE_USER_AUTH,
  );
  const userLogin = useSelector((state: ApplicationState) => state.user.user);
  const actualRoute = window.location.pathname.substring(1).split('/')[1];
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const listItem: ListItem[] = [
    { name: 'Dashboard', icon: DashboardIcon },
    { name: 'Relatórios', icon: ReportIcon },
    { name: 'Alunos', icon: StudentsIcon },
    { name: 'Configurações', icon: ConfigIcon },
  ];

  useEffect(() => {
    if (id) {
      api
        .get(`users/search?id=${id}`, { headers: { Authorization: token } })
        .then(response => {
          dispatch(updateUser(response.data.user));
        })
        .catch(error => {
          toast.error(`${error.response.data.message}`);
          history.push('/login');
        });
    }
  }, [token, id, dispatch, history]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const goLogout = () => {
    history.push('/login');
    dispatch(logout());
  };

  const drawer = (
    <>
      <List className="container-list">
        <img src={WhitelabelLogo} alt="logo" className="img-logo" />
        {userLogin && (
          <span>
            {' '}
            Bem vindo(a) <b>{userLogin.name.split(' ')[0]}</b>{' '}
          </span>
        )}
        {listItem.map((item: ListItem) => (
          <ListItem key={item.name}>
            <div
              id={item.name.toLocaleLowerCase()}
              className="container-button-dash"
              onClick={() => {
                history.push(`/home/${removeSpecialChars(item.name)}`);
                setMobileOpen(false);
              }}
            >
              <img
                src={item.icon}
                alt=""
                className={
                  removeSpecialChars(item.name) === actualRoute
                    ? 'icon-dash selected'
                    : 'icon-dash'
                }
              />
              <div
                className={
                  removeSpecialChars(item.name) === actualRoute
                    ? 'item selected'
                    : 'item'
                }
              >
                {item.name}
              </div>
            </div>
          </ListItem>
        ))}
      </List>
      <ListItem className="container-logout">
        <div className="container-button-dash" onClick={goLogout}>
          <img src={LogoutIcon} alt="logout-icon" />
          <div className="item">Sair</div>
        </div>
      </ListItem>
    </>
  );

  const appBar = (
    <AppBar className="appBar">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
        >
          <MenuIcon style={{ color: '#505050' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  return (
    <div>
      {appBar}
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <DrawerMaterial
            variant="temporary"
            anchor="left"
            className="container-drawer"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </DrawerMaterial>
        </Hidden>
        <Hidden xsDown implementation="css">
          <DrawerMaterial
            classes={{
              paper: classes.drawerPaper,
            }}
            className="container-drawer"
            variant="permanent"
            open
          >
            {drawer}
          </DrawerMaterial>
        </Hidden>
      </nav>
    </div>
  );
};

export default Drawer;
