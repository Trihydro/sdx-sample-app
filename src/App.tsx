import React, { useState } from "react";
import "./App.css";
import {
    REQUESTOBJECTS,
    MISSING_API_KEY_MSG
} from "./Constants";
import { ErrorMsg } from "./ErrorMsg";
import { Loading } from "./Loading";
import useTrait from "./UseTrait";

function App() {
    const keyMissing = !process.env.REACT_APP_API_KEY;
    const urlMissing = !process.env.REACT_APP_URL;
    const baseUrl = urlMissing ? "https://sdx-service.trihydro.com" : process.env.REACT_APP_URL;
    const initialError = keyMissing ? MISSING_API_KEY_MSG : null;

    let requests = REQUESTOBJECTS.map((item) => item.request);

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
    const requestType = useTrait(REQUESTOBJECTS[0].requestType);  // POST or GET
    const queryHeight = useTrait((query.get().split(/\n/)).length);  // determines how high to make the request textarea
    const notes = useTrait(REQUESTOBJECTS[0].notes);  // a brief explanation to the User

    const setUserFields = (item: string, index) => {
        query.set(REQUESTOBJECTS[index].defaultQueryOrBody);
        queryHeight.set((query.get().split(/\n/)).length);
        selectedIndex.set(index);
        url.set(`${baseUrl}/api/${item}`);
        requestType.set(REQUESTOBJECTS[index].requestType);
        notes.set(REQUESTOBJECTS[index].notes);

        console.log(`The setUserFields method has been called with ${item} at ${index}`);
        console.log('URL: ', url.get());
        console.log('RequestType: ', requestType.get());
        console.log('Notes: ', notes.get());
        console.log('and here is what I would expect them to be:');
        console.log('URL: ', `${baseUrl}/api/${item}`);
        console.log('RequestType: ', REQUESTOBJECTS[index].requestType);
        console.log('Query Height: ', (REQUESTOBJECTS[index].defaultQueryOrBody as string).split(/\n/).length);
        console.log('Notes: ', REQUESTOBJECTS[index].notes);
    }

    /**
     * This method handles fetching data from the SDX, using the provided query
     */
    const fetchData = async () => {
        // Verify query is valid JSON
        try {
            JSON.parse(query.get());
        } catch (ex) {
            alert("Query isn't valid JSON.");
            return;
        }

        // Update state, set loading indicator
        setLoading(true);
        results.set("");
        reqStatus.set("");
        submittedUrl.set(
            requestType.get() === "POST"
                ? submittedUrl.get()
                    ? submittedUrl.get()
                    : ""
                : submittedUrl.get()
                    ? `${submittedUrl.get()}${query.get().replace(/(\r\n|\n|\r)/gm, "")}`
                    : ""
        );

        try {
            console.log(`Here you have ${url.get()}`);
            console.log(`And the requestType = ${requestType.get()}`);

            const response = await fetch(`${url.get()}`, {
                method: requestType.get(),
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": process.env.REACT_APP_API_KEY as string
                },
                body: requestType.get() === "POST" ? query.get() : undefined
            });

            // After receiving a response, update the HTTP status code
            reqStatus.set(`Status: ${response.status} ${response.statusText}`);

            // If the response is OK, we have results.
            // If the response was a Bad Request, we have information
            // about why the request was bad
            if (response.status === 200 || response.status === 400) {
                let returnedResults = await response.json();
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
            {console.log(`RETURN has been called and these are the values: ${url.get()}, ${requestType.get()}, ${queryHeight.get()}, ${notes.get()}`)}
        <div className="container">
            <div className="jumbotron">
                {/* Header */}
                <div className="App">
                        <h4>Guide to making Postman requests for SDx</h4>
                    <p className="lead">
                        Please refer to <a href={baseUrl}>{baseUrl}</a> for documentation.
                    </p>
                    <hr />
                </div>
                    {appError.get() !== null && <ErrorMsg msg={appError.get()} />}
                <div className="radio-buttons">
                    {requests.map((item, index) => (
                        <div>
                            <input key={index} defaultChecked={selectedIndex.get() === index} type="radio" name="query-type" value={item} onClick={() => setUserFields(item, index)} />
                            <label htmlFor="item">&nbsp;&nbsp;{item}</label>
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
                                    rows={1}
                                    style={
                                        reqStatus.get().includes("400") ? { backgroundColor: "#f8d7da" } : {}
                                    }
                                    value={requestType.get() === "POST"
                                        ? submittedUrl.get()
                                        : `${submittedUrl.get()}${query.get().replace(/(\r\n|\n|\r)/gm, "")}`}
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
                {/* Body */}
                <>
                        {requestType.get() === "POST" &&
                        <h5>Body of Request</h5>
                    }
                        {requestType.get() !== "POST" &&
                        <h5>Query Arguments</h5>}
                    <div className="form-group">
                        <textarea
                            className="form-control"
                                rows={queryHeight.get()}
                                value={query.get()}
                                onChange={e => query.set(e.target.value)}
                        />
                    </div>
                </>
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
                                value={results.get() ? JSON.stringify(results.get(), null, 2) : ""}
                            />
                            <small className="float-left">{reqStatus.get()}</small>
                            <small className="float-right">
                                {Array.isArray(results.get()) ? `${results.get().length} results` : null}
                            </small>
                        </div>
                    </>
                    }
            </div>
            </div >
        </>
    );
}

export default App;
