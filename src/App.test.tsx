import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { REQUESTOBJECTS } from './Constants.jsx';
import { checkCanUserDeposit, sendSdxRequest } from './sdxService';
import { TEST_API_KEY, TEST_BASE_URL, stubAppEnv } from './testUtils';

// Exhaustive per-request URL/method/header/body coverage lives in sdxService.test.ts,
// which exercises the real (unmocked) service against every REQUESTOBJECTS entry.
// These tests only need to prove App wires user actions to the service correctly and
// reacts to its results, so the network-touching functions are mocked while the pure
// buildSubmittedUrl stays real.
vi.mock('./sdxService', async () => {
    const actual = await vi.importActual<typeof import('./sdxService')>('./sdxService');
    return {
        ...actual,
        checkCanUserDeposit: vi.fn(),
        sendSdxRequest: vi.fn(),
    };
});

const mockCheckCanUserDeposit = vi.mocked(checkCanUserDeposit);
const mockSendSdxRequest = vi.mocked(sendSdxRequest);

beforeEach(() => {
    stubAppEnv();
});

/**
 * Every render mounts an effect that checks deposit eligibility, so tests need to
 * satisfy that call before they can exercise the "Generate Request" button.
 */
async function renderApp(canUserDeposit = false) {
    mockCheckCanUserDeposit.mockResolvedValueOnce(canUserDeposit);
    const user = userEvent.setup({ delay: null });
    render(<App />);
    await waitFor(() => expect(mockCheckCanUserDeposit).toHaveBeenCalledTimes(1));
    return { user };
}

const generateRequestButton = () => screen.getByRole('button', { name: /generate request/i });

/**
 * A couple of REQUESTOBJECTS entries use doubled/tripled internal spaces in their
 * displayText, which survives into the rendered label but not into getByLabelText's
 * whitespace-normalized matching. Selecting by radio index (which lines up 1:1 with
 * REQUESTOBJECTS) sidesteps that.
 */
function selectRequest(item: (typeof REQUESTOBJECTS)[number]) {
    return screen.getAllByRole('radio')[REQUESTOBJECTS.indexOf(item)];
}

describe('deposit eligibility check on mount', () => {
    it('checks eligibility using the configured base URL and API key', async () => {
        await renderApp();

        expect(mockCheckCanUserDeposit).toHaveBeenCalledWith(TEST_BASE_URL, TEST_API_KEY);
    });
});

describe('sending a request', () => {
    it('sends a POST request built from the selected query and displays the result', async () => {
        const { user } = await renderApp();
        mockSendSdxRequest.mockResolvedValueOnce({ status: 200, statusText: 'OK', text: '{"foo":"bar"}' });

        await user.click(generateRequestButton());

        await waitFor(() => expect(mockSendSdxRequest).toHaveBeenCalledTimes(1));
        const args = mockSendSdxRequest.mock.calls[0][0];
        expect(args.requestType).toBe('POST');
        expect(args.apiKey).toBe(TEST_API_KEY);
        expect(args.submittedUrl).toBe(`${TEST_BASE_URL}/api/GetData`);
        expect(() => JSON.parse(args.body as string)).not.toThrow();

        expect(await screen.findByText('Status: 200 OK')).toBeInTheDocument();
        expect(await screen.findByDisplayValue(/"foo": "bar"/)).toBeInTheDocument();
    });

    it('sends a GET request for a query-string based request', async () => {
        const { user } = await renderApp();
        const item = REQUESTOBJECTS.find((r) => r.request === 'GetMessagesBetweenPlaces')!;
        await user.click(selectRequest(item));

        mockSendSdxRequest.mockResolvedValueOnce({ status: 200, statusText: 'OK', text: '[]' });
        await user.click(generateRequestButton());

        await waitFor(() => expect(mockSendSdxRequest).toHaveBeenCalledTimes(1));
        const args = mockSendSdxRequest.mock.calls[0][0];
        expect(args.requestType).toBe('GET');
        expect(args.body).toBeUndefined();
        expect(args.submittedUrl).toBe(
            `${TEST_BASE_URL}/api/GetMessagesBetweenPlaces${item.defaultQueryOrBody.replace(/(\r\n|\n|\r)/gm, '')}`
        );
    });
});

describe('DepositMulti gating', () => {
    const depositItem = REQUESTOBJECTS.find((item) => item.request === 'deposit-multi')!;

    it('blocks the request and alerts when the user is not allowed to deposit', async () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { user } = await renderApp(false);

        await user.click(selectRequest(depositItem));
        await user.click(generateRequestButton());

        expect(alertSpy).toHaveBeenCalledWith(
            'To have the DepositMulti function enabled, you will need to contact Trihydro.'
        );
        expect(mockSendSdxRequest).not.toHaveBeenCalled();
    });

    it('sends the request when the user is allowed to deposit', async () => {
        const { user } = await renderApp(true);
        mockSendSdxRequest.mockResolvedValueOnce({ status: 200, statusText: 'OK', text: '{"ok":true}' });

        await user.click(selectRequest(depositItem));
        await user.click(generateRequestButton());

        await waitFor(() => expect(mockSendSdxRequest).toHaveBeenCalledTimes(1));
        expect(mockSendSdxRequest.mock.calls[0][0].submittedUrl).toBe(`${TEST_BASE_URL}/api/deposit-multi`);
    });
});

describe('client-side validation', () => {
    it('alerts and skips the request when the POST body is not valid JSON', async () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { user } = await renderApp();

        const queryTextarea = screen.getByDisplayValue(/dialogID/);
        await user.clear(queryTextarea);
        await user.type(queryTextarea, 'not valid json');

        await user.click(generateRequestButton());

        expect(alertSpy).toHaveBeenCalledWith("Query isn't valid JSON.");
        expect(mockSendSdxRequest).not.toHaveBeenCalled();
    });
});

describe('response handling', () => {
    it('displays the error payload after a 400 response', async () => {
        const { user } = await renderApp();
        mockSendSdxRequest.mockResolvedValueOnce({
            status: 400,
            statusText: 'Bad Request',
            text: '{"error":"bad request"}',
        });

        await user.click(generateRequestButton());

        expect(await screen.findByText('Status: 400 Bad Request')).toBeInTheDocument();
        expect(await screen.findByDisplayValue(/"error": "bad request"/)).toBeInTheDocument();
    });

    it('surfaces a message when the request fails', async () => {
        const { user } = await renderApp();
        mockSendSdxRequest.mockRejectedValueOnce(new Error('network down'));

        await user.click(generateRequestButton());

        expect(await screen.findByText(/An error has occurred: Error: network down/)).toBeInTheDocument();
    });
});
