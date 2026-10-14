import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REQUESTOBJECTS } from './Constants.jsx';
import { buildSubmittedUrl, checkCanUserDeposit, sendSdxRequest } from './sdxService';
import { jsonResponse, textResponse } from './testUtils';

const API_KEY = 'test-api-key';
const BASE_URL = 'https://example.test';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
});

describe('checkCanUserDeposit', () => {
    it('queries GetCanUserDeposit with the API key and returns true when the API says so', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(true));

        const result = await checkCanUserDeposit(BASE_URL, API_KEY);

        expect(result).toBe(true);
        expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/GetCanUserDeposit`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                apikey: API_KEY,
            },
        });
    });

    it('returns false when the API responds with anything other than true', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(false));

        await expect(checkCanUserDeposit(BASE_URL, API_KEY)).resolves.toBe(false);
    });

    it('propagates a network failure to the caller', async () => {
        fetchMock.mockRejectedValueOnce(new Error('network down'));

        await expect(checkCanUserDeposit(BASE_URL, API_KEY)).rejects.toThrow('network down');
    });
});

describe('buildSubmittedUrl', () => {
    it('appends the outgoing version as a query param for Wzdx/switch-spec-version, regardless of request type', () => {
        const result = buildSubmittedUrl({
            request: 'Wzdx/switch-spec-version',
            requestType: 'POST',
            url: `${BASE_URL}/api/Wzdx/switch-spec-version`,
            query: '{"some":"body"}',
            outgoingVersion: '3.1',
        });

        expect(result).toBe(`${BASE_URL}/api/Wzdx/switch-spec-version?outgoingVersion=3.1`);
    });

    it('leaves the URL bare for other POST requests, since the query is sent as the body', () => {
        const result = buildSubmittedUrl({
            request: 'GetData',
            requestType: 'POST',
            url: `${BASE_URL}/api/GetData`,
            query: '{"dialogID":"156"}',
        });

        expect(result).toBe(`${BASE_URL}/api/GetData`);
    });

    it('appends the query string for GET requests, stripping embedded newlines', () => {
        const result = buildSubmittedUrl({
            request: 'GetMessagesBetweenPlaces',
            requestType: 'GET',
            url: `${BASE_URL}/api/GetMessagesBetweenPlaces`,
            query: '?\nStartLat=1\n&\nEndLat=2',
        });

        expect(result).toBe(`${BASE_URL}/api/GetMessagesBetweenPlaces?StartLat=1&EndLat=2`);
    });

    it.each(REQUESTOBJECTS)('builds the expected URL for the "$displayText" sample request', (item) => {
        const url = `${BASE_URL}/api/${item.request}`;
        const result = buildSubmittedUrl({
            request: item.request,
            requestType: item.requestType,
            url,
            query: item.defaultQueryOrBody,
            outgoingVersion: '2.0',
        });

        if (item.request === 'Wzdx/switch-spec-version') {
            expect(result).toBe(`${url}?outgoingVersion=2.0`);
        } else if (item.requestType === 'POST') {
            expect(result).toBe(url);
        } else {
            expect(result).toBe(`${url}${item.defaultQueryOrBody.replace(/(\r\n|\n|\r)/gm, '')}`);
        }
    });
});

describe('sendSdxRequest', () => {
    it('sends a GET request with no body', async () => {
        fetchMock.mockResolvedValueOnce(textResponse('some text', { status: 200, statusText: 'OK' }));

        const result = await sendSdxRequest({
            submittedUrl: `${BASE_URL}/api/GetMessagesBetweenPlaces?StartLat=1`,
            requestType: 'GET',
            apiKey: API_KEY,
        });

        expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/GetMessagesBetweenPlaces?StartLat=1`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                apikey: API_KEY,
            },
        });
        expect(result).toEqual({ status: 200, statusText: 'OK', text: 'some text' });
    });

    it('sends a POST request with the given body', async () => {
        fetchMock.mockResolvedValueOnce(textResponse('{"ok":true}', { status: 200, statusText: 'OK' }));

        const body = '{"dialogID":"156"}';
        const result = await sendSdxRequest({
            submittedUrl: `${BASE_URL}/api/GetData`,
            requestType: 'POST',
            apiKey: API_KEY,
            body,
        });

        expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/GetData`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                apikey: API_KEY,
            },
            body,
        });
        expect(result).toEqual({ status: 200, statusText: 'OK', text: '{"ok":true}' });
    });

    it.each(REQUESTOBJECTS)('sends the correct $requestType request for "$displayText"', async (item) => {
        fetchMock.mockResolvedValueOnce(textResponse('{"ok":true}'));

        const submittedUrl = buildSubmittedUrl({
            request: item.request,
            requestType: item.requestType,
            url: `${BASE_URL}/api/${item.request}`,
            query: item.defaultQueryOrBody,
            outgoingVersion: '2.0',
        });

        await sendSdxRequest({
            submittedUrl,
            requestType: item.requestType,
            apiKey: API_KEY,
            body: item.requestType === 'POST' ? item.defaultQueryOrBody : undefined,
        });

        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(options.method).toBe(item.requestType);
        expect(options.headers).toMatchObject({ apikey: API_KEY });
        if (item.requestType === 'POST') {
            expect(options.body).toBe(item.defaultQueryOrBody);
        } else {
            expect(options.body).toBeUndefined();
        }
    });

    it('reports non-2xx statuses without throwing', async () => {
        fetchMock.mockResolvedValueOnce(textResponse('Bad Request', { status: 400, statusText: 'Bad Request' }));

        const result = await sendSdxRequest({
            submittedUrl: `${BASE_URL}/api/GetData`,
            requestType: 'POST',
            apiKey: API_KEY,
            body: '{}',
        });

        expect(result).toEqual({ status: 400, statusText: 'Bad Request', text: 'Bad Request' });
    });

    it('propagates a network failure to the caller', async () => {
        fetchMock.mockRejectedValueOnce(new Error('network down'));

        await expect(
            sendSdxRequest({ submittedUrl: `${BASE_URL}/api/GetData`, requestType: 'POST', apiKey: API_KEY, body: '{}' })
        ).rejects.toThrow('network down');
    });
});
