import React, { useState } from 'react';
import "./App.css";
import {
    REQUESTOBJECTS,
    MISSING_API_KEY_MSG,
    VALID_OUTGOING_VERSIONS
} from "./Constants";
import { ErrorMsg } from "./ErrorMsg";
import { Loading } from "./Loading";
import useTrait from "./UseTrait";

function App() {
    const keyMissing = !process.env.REACT_APP_API_KEY;
    const urlMissing = !process.env.REACT_APP_URL;
    const baseUrl = urlMissing ? "https://sdx-service.trihydro.com" : process.env.REACT_APP_URL;
    const initialError = keyMissing ? MISSING_API_KEY_MSG : null;

    let requests = REQUESTOBJECTS;
    let validOutgoingVersions = VALID_OUTGOING_VERSIONS;

    // State Hooks
    const [loading, setLoading] = useState(false);          // Loading indicator (true when query is in progress)

    // very important note:  set<xxx> in useState is asynchronous, so the value of xxx will not be updated immediately.
    // We need the synchronous value.  We are using useTrait from https://dev.to/bytebodger/synchronous-state-with-react-hooks-1k4f
    // UseTrait works great with numbers and strings but is problematic with large, complex, or inherently asynchronous values
    const query = useTrait((REQUESTOBJECTS[0].defaultQueryOrBody as string).replace("QQQ", new Date().toISOString()));  // Value of the Query textarea
    const results = useTrait("");  // Values returned by SDX (displayed in the Results textarea)
    const reqStatus = useTrait("");  // HTTP Status Code (and text) from most-recent query
    const appError = useTrait(initialError);  // Storage for error message
    const selectedIndex = useTrait(0);  // Index of the selected radio button
    const url = useTrait(`${baseUrl}/api/${REQUESTOBJECTS[0].request}`);  // this is the URL that will be sent
    const submittedUrl = useTrait("");  // this is the URL that was sent
    const request = useTrait(REQUESTOBJECTS[0].request);  // the request that was selected
    const requestType = useTrait(REQUESTOBJECTS[0].requestType);  // POST or GET
    const queryHeight = useTrait((query.get().split(/\n/)).length);  // determines how high to make the request textarea
    const notes = useTrait(REQUESTOBJECTS[0].notes);  // a brief explanation to the User
    const outgoingVersionIndex = useTrait(0);  // for the switch-spec-version request

    const setUserFields = (item: { displayText: string; request: string; requestType: string; defaultQueryOrBody: string; notes: string; outgoingVersion?: undefined; } | { displayText: string; request: string; requestType: string; defaultQueryOrBody: string; notes: string; outgoingVersion: string; }, index: number) => {
        query.set(REQUESTOBJECTS[index].defaultQueryOrBody.replace("QQQ", new Date().toISOString()));
        queryHeight.set((query.get().split(/\n/)).length);
        selectedIndex.set(index);
        url.set(`${baseUrl}/api/${item.request}`);
        request.set(item.request);
        requestType.set(REQUESTOBJECTS[index].requestType);
        notes.set(REQUESTOBJECTS[index].notes);
        results.set("");
        outgoingVersionIndex.set(0);
    }

    /**
     * This method handles fetching data from the SDX, using the provided query
     */
    const fetchData = async () => {
        if (requestType.get() === "POST") {
            // Verify query is valid JSON
            try {
                JSON.parse(query.get());
            } catch (ex) {
                alert("Query isn't valid JSON.");
                return;
            }
        }

        // Update state, set loading indicator
        setLoading(true);
        results.set("");
        reqStatus.set("");

        submittedUrl.set(
            request.get() === "Wzdx/switch-spec-version" ? `${url.get()}?outgoingVersion=${validOutgoingVersions[outgoingVersionIndex.get()]}`
                :
            requestType.get() === "POST"
                ? url.get()
                : `${url.get()}${query.get().replace(/(\r\n|\n|\r)/gm, "")}`
        );

        try {
            const response =
                requestType.get() === "POST" ? await fetch(`${submittedUrl.get()}`, {
                    method: requestType.get(),
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.REACT_APP_API_KEY as string
                    },
                    body: query.get()
                })
                    : await fetch(`${submittedUrl.get()}`, {
                        method: requestType.get(),
                        mode: "cors",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": process.env.REACT_APP_API_KEY as string
                        }
                    })
                ;

            let earlyResults = await response.text();

            if (response.status === 200 && earlyResults.length === 0) {
                earlyResults = "No results returned";
            }

            // After receiving a response, update the HTTP status code
            reqStatus.set(`Status: ${response.status} ${response.statusText}`);

            // If the response is OK, we have results.
            // If the response was a Bad Request, we have information
            // about why the request was bad
            if (response.status === 404) {
                results.set("404 Not Found");
            }
            if (response.status === 200 || response.status === 400) {
                let returnedResults = earlyResults;
                results.set(returnedResults);
            }
        } catch (ex) {
            appError.set(`An error has occurred: ${ex}`);
        }

        // Request is finished, reset loading indicator
        setLoading(false);
    };

    return (
        <>
        <div className="container">
                <div className="jumbotron">
                {/* Header */}
                <div className="App">
                        <h4>SDx API Query Examples</h4>
                    <p className="lead">
                        Please refer to <a href={baseUrl}>{baseUrl}</a> for documentation.
                    </p>
                    <hr />
                </div>
                    {appError.get() !== null && <ErrorMsg msg={appError.get()} />}
                <div className="radio-buttons">
                    {requests.map((item, index) => (
                        <div>
                            <input key={index} defaultChecked={selectedIndex.get() === index} type="radio" name="query-type" value={item.displayText} onClick={() => setUserFields(item, index)} />
                            <label htmlFor="item">&nbsp;&nbsp;{item.displayText}</label>
                        </div>
                    ))}                    
                </div>
                    {notes.get() &&
                        <div className="form-group">
                            <h5>Notes for this request:</h5>
                            <textarea
                                readOnly
                                id="notes"
                                className="form-control"
                                rows={1}
                                style={
                                    reqStatus.get().includes("400") ? { backgroundColor: "#f8d7da" } : {}
                                }
                                value={notes.get()}
                            />
                        </div>
                    }
                <div>
                        <br />
                        {results.get().length > 0 && <>
                            <div className="form-group">
                                <h5><b>{requestType.get()}</b> with this Request URL:</h5>
                                <textarea
                                    readOnly
                                    id="submittedUrl"
                                    className="form-control"
                                    rows={requestType.get() === "POST" ? 1 : 2}
                                    style={
                                        reqStatus.get().includes("400") ? { backgroundColor: "#f8d7da" } : {}
                                    }
                                    value={submittedUrl.get()}
                                />
                            </div>
                        </>
                        }
                        {results.get().length === 0 && <>
                            <h5>The request will display when you click 'Submit'</h5>
                        </>
                        }
                    <br />
                    </div>
                    {request.get() === "Wzdx/switch-spec-version" &&
                        <>
                        Desired Outgoing Version
                        <div className="outgoing=version-radio-buttons">
                            {validOutgoingVersions.map((item, index) => (
                                <div>
                                    <input key={item} defaultChecked={outgoingVersionIndex.get() === index} type="radio" name="outgoing-version" value={item} onClick={() => outgoingVersionIndex.set(index)} />
                                    <label htmlFor="item">&nbsp;&nbsp;{item}</label>
                                </div>
                            ))}
                        </div>
                    </>
                    }
                    <button
                        type="button"
                        className="btn btn-primary float-right"
                        onClick={fetchData}
                        disabled={appError.get() !== null || loading}
                    >
                        {loading ? <Loading /> : "Submit"}
                    </button>
                    {results.get().length > 0 && <>
                        <h5 style={{ clear: "both" }}>Results</h5>
                        <div className="form-group">
                            <textarea
                                readOnly
                                id="results"
                                className="form-control"
                                rows={10}
                                style={
                                    reqStatus.get().includes("400") ? { backgroundColor: "#f8d7da" } : {}
                                }
                                value={results.get()}
                            />
                            <small className="float-left">{reqStatus.get()}</small>
                            <small className="float-right">
                                {Array.isArray(results.get()) ? `${results.get().length} results` : null}
                            </small>
                        </div>
                    </>
                    }
                    {/* Body */}
                    <>
                        {
                            requestType.get() === "POST" &&
                            <h5>Body of Request</h5>
                        }
                        {
                            requestType.get() !== "POST" && query.get().length > 0 &&
                            <h5>Query Arguments</h5>
                        }
                        {
                            query.get().length > 0 &&
                            <div className="form-group">
                                <textarea
                                    className="form-control"
                                    rows={queryHeight.get()}
                                    value={query.get()}
                                    onChange={e => query.set(e.target.value)}
                                />
                            </div>
                        }
                    </>
            </div>
            </div >
        </>
    );
}

export default App;

