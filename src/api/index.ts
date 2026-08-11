export async function api<T>(path: string, params: RequestInit = {}): Promise<T> {
  const headers = new Headers(params.headers);
  if (params.body) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(`/api${path}`, { ...params, headers });

  if (!response.ok) {
    let errorMsg = 'Неизвестная ошибка';

    try {
      const data = (await response.json()) as { message: string };
      if (data.message) {
        errorMsg = data.message;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
