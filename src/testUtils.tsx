import { vi } from 'vitest';

export const TEST_API_KEY = 'test-api-key';
export const TEST_BASE_URL = 'https://example.test';

export function stubAppEnv() {
    vi.stubEnv('VITE_API_KEY', TEST_API_KEY);
    vi.stubEnv('VITE_URL', TEST_BASE_URL);
}

export function jsonResponse(
    value: unknown,
    init: { status?: number; statusText?: string } = {}
): Response {
    return {
        status: init.status ?? 200,
        statusText: init.statusText ?? 'OK',
        json: async () => value,
        text: async () => JSON.stringify(value),
    } as Response;
}

export function textResponse(
    value: string,
    init: { status?: number; statusText?: string } = {}
): Response {
    return {
        status: init.status ?? 200,
        statusText: init.statusText ?? 'OK',
        json: async () => JSON.parse(value || 'null'),
        text: async () => value,
    } as Response;
}

/**
 * The app substitutes the literal "QQQ" placeholder (and re-derives it on every
 * radio selection) with `new Date().toISOString()`, and real ISO timestamps also
 * appear verbatim elsewhere in the default bodies. Normalizing both the expected
 * and actual strings avoids asserting against a timestamp captured at a different
 * instant than the one the component used.
 */
export function normalizeTimestamps(value: string): string {
    return value
        .replace(/QQQ/g, 'TIMESTAMP')
        .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/g, 'TIMESTAMP');
}
