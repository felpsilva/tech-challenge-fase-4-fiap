import { API_BASE_URL } from '@/constants/api';
import { ApiErrorBody } from '@/types/api';
import { File } from 'expo-file-system';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string | null;
}

function getErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as ApiErrorBody).message;
    if (message) return message;
  }
  return `Falha na requisição à API (status ${status}).`;
}

export async function apiRequest<T>(
  path: string,
  { body, token, headers, ...options }: RequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json');
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Não foi possível conectar à API.', 0);
  }

  const responseText = await response.text();
  let responseBody: unknown;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }
  if (!response.ok) throw new ApiError(getErrorMessage(responseBody, response.status), response.status);
  return responseBody as T;
}

export async function apiUploadFile<T>(
  path: string,
  token: string,
  file: { uri: string; name: string; type: string },
): Promise<T> {
  const formData = new FormData();
  const nativeFile = new File(file.uri);
  formData.append('file', nativeFile, file.name);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: formData,
    });
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Não foi possível conectar à API.', 0);
  }

  const responseText = await response.text();
  let responseBody: unknown;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }
  if (!response.ok) throw new ApiError(getErrorMessage(responseBody, response.status), response.status);
  return responseBody as T;
}
