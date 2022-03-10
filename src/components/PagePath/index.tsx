/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/require-default-props */
import React from 'react';
import './styles.scss';
import { Jumbotron, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { ReactComponent as HomeIcon } from '../../images/home-icon.svg';

interface Props {
  pathName?: string;
}

const PagePath: React.FC<Props> = (props: Props) => {
  const { pathName } = props;
  const history = useHistory();
  const path = window.location.pathname.split('/');

  const goRoute = (route: string) => {
    history.push(`/home/${route}`);
  };

  return (
    <Jumbotron className="page-path">
      <Col xs={6}>
        {path.length === 5 ? (
          <h3>{pathName || path[path.length - 2]}</h3>
        ) : (
          <h3>{pathName || path[path.length - 1]}</h3>
        )}
      </Col>
      <Col>
        <HomeIcon className="home-icon" />
        {path.length === 3 && (
          <>
            /{' '}
            <a href="#" onClick={() => goRoute(path[path.length - 1])}>
              {' '}
              {pathName || path[path.length - 1]}{' '}
            </a>
          </>
        )}
        {path.length === 4 && (
          <>
            /{' '}
            <a href="#" onClick={() => goRoute(path[path.length - 2])}>
              {' '}
              {pathName || path[path.length - 2]}{' '}
            </a>{' '}
            /{' '}
            <a
              href="#"
              onClick={() =>
                goRoute(`${path[path.length - 2]}/${path[path.length - 1]}`)
              }
            >
              {' '}
              {path[path.length - 1]}{' '}
            </a>
          </>
        )}
        {path.length === 5 && (
          <>
            /{' '}
            <a href="#" onClick={() => goRoute(path[path.length - 3])}>
              {' '}
              {pathName || path[path.length - 3]}{' '}
            </a>{' '}
            / <a href="#"> {path[path.length - 2]} </a>
          </>
        )}
      </Col>
    </Jumbotron>
  );
};

export default PagePath;
