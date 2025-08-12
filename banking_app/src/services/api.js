const API_URL = 'http://localhost:8080/api';

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');

    const headers = {
        ...(options.body && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    let data;
    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (isJson) {
        data = await res.json().catch(() => null);
    }

    if (!res.ok) {
        throw new Error(data?.message || `Erreur API (${res.status})`);
    }

    return data;
}
