export function mockJson(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: unknown) {
  const init: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) init.body = JSON.stringify(body);
  return new Request(new URL(url, 'http://localhost').toString(), init);
}

export function mockFormData(method: 'POST', url: string, formData: FormData) {
  return new Request(new URL(url, 'http://localhost').toString(), {
    method,
    body: formData
  });
}

export function mockQuery(method: 'GET', url: string, params: Record<string, string>) {
  const urlObj = new URL(url, 'http://localhost');
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value);
  });
  return new Request(urlObj.toString(), { method });
}
