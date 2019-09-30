import React, { useState } from "react";
import "./App.css";
import {
  URL,
  DEFAULT_QUERY,
  DEFAULT_QUERY_HEIGHT,
  MISSING_API_KEY_MSG
} from "./Constants";
import { ErrorMsg } from "./ErrorMsg";
import { Loading } from "./Loading";

function App() {
  const keyMissing = !process.env.REACT_APP_API_KEY;
  const initialError = keyMissing ? MISSING_API_KEY_MSG : null;

  // State Hooks
  const [query, setQuery] = useState(DEFAULT_QUERY);      // Value of the Query textarea
  const [results, setResults] = useState("");             // Values returned by SDX (displayed in the Results textarea)
  const [reqStatus, setReqStatus] = useState("");         // HTTP Status Code (and text) from most-recent query
  const [loading, setLoading] = useState(false);          // Loading indicator (true when query is in progress)
  const [appError, setAppError] = useState(initialError); // Storage for error message

  /**
   * This method handles fetching data from the SDX, using the provided query
   */
  const fetchData = async () => {
    // Verify query is valid JSON
    try {
      JSON.parse(query);
    } catch (ex) {
      alert("Query isn't valid JSON.");
      return;
    }

    // Update state, set loading indicator
    setLoading(true);
    setResults("");
    setReqStatus("");

    try {
      const response = await fetch(`${URL}/api/GetData`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.REACT_APP_API_KEY
        },
        body: query
      });

      // After receiving a response, update the HTTP status code
      setReqStatus(`Status: ${response.status} ${response.statusText}`);

      // If the response is OK, we have results.
      // If the response was a Bad Request, we have information
      // about why the request was bad
      if (response.status === 200 || response.status === 400) {
        let results = await response.json();
        setResults(results);
      }
    } catch (ex) {
      setAppError(`An error has occurred: ${ex}`);
    }

    // Request is finished, reset loading indicator
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="jumbotron">
        {/* Header */}
        <div className="App">
          <h1 className="display-4">SDX API Sample Application</h1>
          <p className="lead">
            Please refer to <a href={URL}>{URL}</a> for documentation.
          </p>
          <hr />
        </div>
        {appError !== null && <ErrorMsg msg={appError} />}

        {/* Body */}
        <h3>Query</h3>
        <div className="form-group">
          <textarea
            className="form-control"
            rows={DEFAULT_QUERY_HEIGHT}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={fetchData}
          disabled={appError !== null || loading}
        >
          {loading ? <Loading /> : "Submit"}
        </button>
        <h3 style={{ clear: "both" }}>Results</h3>
        <div className="form-group">
          <textarea
            readOnly
            id="results"
            className="form-control"
            rows={10}
            style={
              reqStatus.includes("400") ? { backgroundColor: "#f8d7da" } : {}
            }
            value={results ? JSON.stringify(results, null, 2) : ""}
            onChange={e => setQuery(e.target.value)}
          />
          <small className="float-left">{reqStatus}</small>
          <small className="float-right">
            {Array.isArray(results) ? `${results.length} results` : null}
          </small>
        </div>
      </div>
    </div>
  );
}

export default App;
