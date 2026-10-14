import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { REQUESTOBJECTS } from './Constants.jsx';
import { jsonResponse, stubAppEnv, textResponse } from './testUtils';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    stubAppEnv();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    // The default query bodies embed `new Date().toISOString()`, which would
    // otherwise make every snapshot different from the last run.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

async function renderApp(canUserDeposit = false) {
    fetchMock.mockResolvedValueOnce(jsonResponse(canUserDeposit));
    const user = userEvent.setup({ delay: null });
    const view = render(<App />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    return { user, ...view };
}

describe('App snapshots', () => {
    it('matches the initial render with a configured API key', async () => {
        const { container } = await renderApp();
        expect(container).toMatchSnapshot();
    });

    it('matches the render when the API key is missing', async () => {
        vi.stubEnv('VITE_API_KEY', '');
        const { container } = await renderApp();
        expect(container).toMatchSnapshot();
    });

    for (const item of REQUESTOBJECTS.filter((r) => r.request !== 'deposit-multi')) {
        it(`matches the render after selecting "${item.displayText}"`, async () => {
            const { user, container } = await renderApp();
            const index = REQUESTOBJECTS.indexOf(item);
            await user.click(screen.getAllByRole('radio')[index]);
            expect(container).toMatchSnapshot();
        });
    }

    it('matches the render with populated results', async () => {
        const { user, container } = await renderApp();
        fetchMock.mockResolvedValueOnce(textResponse(JSON.stringify({ foo: 'bar', baz: [1, 2, 3] })));

        await user.click(screen.getByRole('button', { name: /generate request/i }));
        await screen.findByText('Status: 200 OK');

        expect(container).toMatchSnapshot();
    });
});
