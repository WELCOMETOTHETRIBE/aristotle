import { z } from 'zod';

export class ApiError extends Error {
  constructor(public status: number, public detail: unknown) { 
    super(`API ${status}`); 
  }
}

async function parseJson<T>(res: Response, schema: z.ZodType<T>) {
  const json = await res.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new ApiError(res.status, parsed.error.flatten());
  return parsed.data;
}

export const api = {
  async get<T>(url: string, out: z.ZodType<T>) {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return parseJson(res, out);
  },
  
  async post<I, O>(url: string, inn: z.ZodType<I>, out: z.ZodType<O>, body: I) {
    const inRes = inn.safeParse(body);
    if (!inRes.success) throw new ApiError(400, inRes.error.flatten());
    
    const res = await fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(body), 
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return parseJson(res, out);
  },
  
  async upload<I, O>(url: string, inn: z.ZodType<I>, out: z.ZodType<O>, formData: FormData) {
    const res = await fetch(url, { 
      method: 'POST', 
      body: formData
    });
    
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return parseJson(res, out);
  }
};
