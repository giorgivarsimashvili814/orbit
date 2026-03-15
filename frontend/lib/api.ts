import { useAuthStore } from '@/store/auth.store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(url: string, options: RequestInit = {}) {
  const { accessToken } = useAuthStore.getState();

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshResponse.ok) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return refreshResponse;
    }

    const { accessToken: newToken } = await refreshResponse.json();
    useAuthStore.getState().setAuth(newToken, useAuthStore.getState().user!);

    return apiFetch(url, options);
  }

  return response;
}