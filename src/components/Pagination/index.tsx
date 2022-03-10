/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import './styles.scss';
import { Pagination as PaginateMUI } from '@material-ui/lab';
import { Row } from 'react-bootstrap';

interface Props {
  postsPerPage: number;
  totalPosts: number;
  paginate: any;
}

const Pagination: React.FC<Props> = (props: Props) => {
  const { paginate, postsPerPage, totalPosts } = props;
  const [page, setPage] = useState(1);
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    paginate(value);
  };

  return (
    <Row className="container-pagination">
      <p>
        Página {page} de {pageNumbers.length}{' '}
      </p>
      <PaginateMUI
        count={pageNumbers.length}
        siblingCount={0}
        page={page}
        onChange={handleChange}
      />
    </Row>
  );
};

export default Pagination;
