import React, { useState } from "react";
import "./App.css";
import {
    REQUESTOBJECTS,
    MISSING_API_KEY_MSG
} from "./Constants";
import { ErrorMsg } from "./ErrorMsg";
import { Loading } from "./Loading";

function App() {
    const keyMissing = !process.env.REACT_APP_API_KEY;
    const urlMissing = !process.env.REACT_APP_URL;
    const baseUrl = urlMissing ? "https://sdx-service.trihydro.com" : process.env.REACT_APP_URL;
    const initialError = keyMissing ? MISSING_API_KEY_MSG : null;

    let requests = REQUESTOBJECTS.map((item) => item.request);

    // State Hooks
    const [query, setQuery] = useState(REQUESTOBJECTS[0].defaultQueryOrBody.replace("QQQ", new Date().toISOString()));      // Value of the Query textarea
    const [results, setResults] = useState("");             // Values returned by SDX (displayed in the Results textarea)
    const [reqStatus, setReqStatus] = useState("");         // HTTP Status Code (and text) from most-recent query
    const [loading, setLoading] = useState(false);          // Loading indicator (true when query is in progress)
    const [appError, setAppError] = useState(initialError); // Storage for error message
    const [selectedIndex, setSelectedIndex] = useState(0); // Index of the selected radio button
    const [url, setUrl] = useState(`${baseUrl}/api/${REQUESTOBJECTS[0].request}`);
    const [submittedUrl, setSubmittedUrl] = useState("");
    const [method, setMethod] = useState(REQUESTOBJECTS[0].requestType);
    const [queryHeight, setQueryHeight] = useState(query.split(/\n/).length);

    const setUserFields = (item: string, index) => {
        setSelectedIndex(index);
        setUrl(`${baseUrl}/api/${item}`);
        setMethod(REQUESTOBJECTS[index].requestType);
        setQueryHeight(REQUESTOBJECTS[index].defaultQueryOrBody.split(/\n/).length);
    }

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
        setSubmittedUrl(url);
        setResults("");
        setReqStatus("");

        try {
            console.log(`Here you have ${url}`);
            console.log(`And the method = ${method}`);

            const response = await fetch(`${url}`, {
                method: method as string,
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": process.env.REACT_APP_API_KEY as string
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
                        Please refer to <a href={baseUrl}>{baseUrl}</a> for documentation.
                    </p>
                    <hr />
                </div>
                {appError !== null && <ErrorMsg msg={appError} />}
                <div className="radio-buttons">
                    {requests.map((item, index) => (
                        <div>
                            <input key={index} defaultChecked={selectedIndex === index} type="radio" name="query-type" value={item} onClick={() => setUserFields(item, index)} />
                            <label htmlFor="item">&nbsp;&nbsp;{item}</label>
                        </div>
                    ))}                    
                </div>
                <div>
                    <br />
                    <h5>Type of request: <b>{method}</b></h5>
                    <br />
                </div>
                {/* Body */}
                <>
                    {method === "POST" &&
                        <h5>Body of Request</h5>
                    }
                    {method != "POST" &&
                        <h5>Query Arguments</h5>}
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            rows={queryHeight}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                </>
                <button
                    type="button"
                    className="btn btn-primary float-right"
                    onClick={fetchData}
                    disabled={appError !== null || loading}
                >
                    {loading ? <Loading /> : "Submit"}
                </button>
                <h5 style={{ clear: "both" }}>Submitted URL</h5>
                <div className="form-group">
                    <textarea
                        readOnly
                        id="submittedUrl"
                        className="form-control"
                        rows={1}
                        style={
                            reqStatus.includes("400") ? { backgroundColor: "#f8d7da" } : {}
                        }
                        value={method === "POST"
                            ? submittedUrl
                                ? submittedUrl
                                : ""
                            : submittedUrl
                                ? `${submittedUrl}${query.replace(/(\r\n|\n|\r)/gm, "")}`
                                : ""}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
                <h5 style={{ clear: "both" }}>Results</h5>
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
