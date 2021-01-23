import React, { useState } from "react";
import "./App.css";
import FetchJobs from "./components/useFetchJobs";
import Loading from "./components/Loading";
import Job from "./components/Job";
import { Container } from "react-bootstrap";
import JobPages from "./components/Pagination";
import SearchForm from "./components/SeachForm";

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error, hasNextPage } = FetchJobs(params, page);

  //-----Search Engine Logic---------
  function applyParamChange(e) {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams((previousParams) => {
      return {
        ...previousParams,
        [param]: value,
      };
    });
  }

  return (
    <div className="App">
      <Container className="container my-5">
        <h1 className="mb-3">Jobs Finder</h1>
        <h3 className="mb-5 text-muted font-weight-light">
          Discover the latest entries from GitHub Jobs API
        </h3>
        <SearchForm params={params} onParamChange={applyParamChange} />
        <JobPages page={page} setPage={setPage} hasNextPage={hasNextPage} />
        {loading && <Loading />}
        {error && (
          <h4 className="error">There was an error. Try Refreshing.</h4>
        )}
        {!loading &&
          !error &&
          jobs.map((job) => {
            return <Job key={job.id} job={job} />;
          })}
        <JobPages page={page} setPage={setPage} hasNextPage={hasNextPage} />
      </Container>
    </div>
  );
}

export default App;
