export interface SdxRequestResult {
    status: number;
    statusText: string;
    text: string;
}

const jsonHeaders = (apiKey: string) => ({
    "Content-Type": "application/json",
    apikey: apiKey,
});

/**
 * Checks whether the current API key is permitted to use the DepositMulti endpoint.
 */
export async function checkCanUserDeposit(baseUrl: string, apiKey: string): Promise<boolean> {
    const response = await fetch(`${baseUrl}/api/GetCanUserDeposit`, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: jsonHeaders(apiKey),
    });
    const data = await response.json();
    return data === true;
}

export interface BuildSubmittedUrlParams {
    request: string;
    requestType: string;
    url: string;
    query: string;
    outgoingVersion?: string;
}

/**
 * Builds the final URL that will be sent to the SDX for a given request/query
 * combination. Wzdx/switch-spec-version carries its target version as a query
 * param; other GET requests append the (already-edited) query textarea contents;
 * POST requests send the query as the body instead, so the URL is left bare.
 */
export function buildSubmittedUrl({
    request,
    requestType,
    url,
    query,
    outgoingVersion,
}: BuildSubmittedUrlParams): string {
    if (request === "Wzdx/switch-spec-version") {
        return `${url}?outgoingVersion=${outgoingVersion}`;
    }
    if (requestType === "POST") {
        return url;
    }
    return `${url}${query.replace(/(\r\n|\n|\r)/gm, "")}`;
}

export interface SendSdxRequestParams {
    submittedUrl: string;
    requestType: string;
    apiKey: string;
    body?: string;
}

/**
 * Sends a query to the SDX and returns the raw status/text of the response.
 */
export async function sendSdxRequest({
    submittedUrl,
    requestType,
    apiKey,
    body,
}: SendSdxRequestParams): Promise<SdxRequestResult> {
    const response =
        requestType === "POST"
            ? await fetch(submittedUrl, {
                method: requestType,
                mode: "cors",
                cache: "no-cache",
                headers: jsonHeaders(apiKey),
                body,
            })
            : await fetch(submittedUrl, {
                method: requestType,
                mode: "cors",
                cache: "no-cache",
                headers: jsonHeaders(apiKey),
            });

    const text = await response.text();
    return { status: response.status, statusText: response.statusText, text };
}
