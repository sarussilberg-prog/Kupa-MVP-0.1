describe('api base URL', () => {
    const originalDev = (global as any).__DEV__;
    const originalEnv = process.env.EXPO_PUBLIC_API_URL;

    afterEach(() => {
        (global as any).__DEV__ = originalDev;
        if (originalEnv === undefined) {
            delete process.env.EXPO_PUBLIC_API_URL;
        } else {
            process.env.EXPO_PUBLIC_API_URL = originalEnv;
        }
        jest.resetModules();
    });

    it('uses EXPO_PUBLIC_API_URL when set', () => {
        process.env.EXPO_PUBLIC_API_URL = 'http://192.168.1.10:3000/api';
        jest.resetModules();
        const { getApiBaseUrl } = require('../../services/api');
        expect(getApiBaseUrl()).toBe('http://192.168.1.10:3000/api');
    });

    it('falls back to localhost in __DEV__ when env unset', () => {
        delete process.env.EXPO_PUBLIC_API_URL;
        (global as any).__DEV__ = true;
        jest.resetModules();
        const { getApiBaseUrl } = require('../../services/api');
        expect(getApiBaseUrl()).toBe('http://localhost:3000/api');
    });
});
