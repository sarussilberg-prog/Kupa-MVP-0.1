/**
 * API Service Layer
 * Wraps native fetch with custom API layer
 * All API calls go through this service
 */

import { ApiResponse } from '@cost-share/shared';

const API_BASE_URL = __DEV__
    ? 'http://172.20.10.2:3000/api'  // Your Mac's local IP address
    : 'http://localhost:3000/api';

/**
 * Generic API request wrapper
 */
async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T>(
    endpoint: string,
    body: unknown
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * PUT request
 */
export async function apiPut<T>(
    endpoint: string,
    body: unknown
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
}
