import React from "react";
import { Pagination } from "react-bootstrap";

export default function JobPages({ page, setPage, hasNextPage }) {
  function changePage(number) {
    setPage((previousPage) => previousPage + number);
  }

  return (
    <Pagination>
      {page !== 1 && <Pagination.Prev onClick={() => changePage(-1)} />}
      {page !== 1 && (
        <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>
      )}
      {page > 2 && <Pagination.Ellipsis />}
      {page > 2 && (
        <Pagination.Item onClick={() => changePage(-1)}>
          {page - 1}
        </Pagination.Item>
      )}
      <Pagination.Item active>{page}</Pagination.Item>
      {hasNextPage && (
        <Pagination.Item onClick={() => changePage(1)}>
          {page + 1}
        </Pagination.Item>
      )}
      {hasNextPage && <Pagination.Next onClick={() => changePage(1)} />}
    </Pagination>
  );
}
