import React from "react";
import { useReducer, useEffect } from "react";
import axios from "axios";

//Possible actions to the API
const actions = {
  makeRequest: "make-request",
  getData: "get-data",
  error: "error",
  updateHasNextPage: "update-hase-next-page",
};

const baseUrl =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";

//function to modify the state based on the action
const reducer = (state, action) => {
  switch (action.type) {
    case actions.makeRequest:
      return { loading: true, jobs: [] };

    case actions.getData:
      return { ...state, loading: false, jobs: action.payload.jobs };

    case actions.error:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: [],
      };

    case actions.updateHasNextPage:
      return { ...state, hasNextPage: action.payload.hasNextPage };

    default:
      return state;
  }
};

//actual component
export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => {
    //preventing too many API calls all at once
    const cancelToken1 = axios.CancelToken.source();

    dispatch({ type: actions.makeRequest });
    axios
      .get(baseUrl, {
        //preventing too many API calls all at once
        cancelToken: cancelToken1.token,
        params: { markdown: true, page: page, ...params },
      })
      .then((res) => {
        dispatch({ type: actions.getData, payload: { jobs: res.data } });
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          return;
        }
        dispatch({ type: actions.error, payload: { error: e } });
      });
    //-------------------------------------------------------------------------
    const cancelToken2 = axios.CancelToken.source();
    axios
      .get(baseUrl, {
        //preventing too many API calls all at once
        cancelToken: cancelToken2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
      .then((res) => {
        dispatch({
          type: actions.updateHasNextPage,
          payload: { hasNextPage: res.data.length !== 0 },
        });
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          return;
        }
        dispatch({ type: actions.error, payload: { error: e } });
      });

    return () => {
      //clearing up the request code
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
}
