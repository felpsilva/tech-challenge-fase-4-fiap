import { apiRequest, apiUploadFile } from '@/lib/api-client';
import { API_BASE_URL } from '@/constants/api';
import { CreatePostInput, Post, UpdatePostInput } from '@/types/api';

export const postService = {
  list(token?: string | null) {
    return apiRequest<Post[]>('/post', { token });
  },

  search(query: string, token?: string | null) {
    const params = new URLSearchParams({ q: query });
    return apiRequest<Post[]>(`/post/search?${params.toString()}`, { token });
  },

  get(id: number, token?: string | null) {
    return apiRequest<Post>(`/post/${id}`, { token });
  },

  create(token: string, input: CreatePostInput) {
    return apiRequest<Post>('/post', { method: 'POST', token, body: input });
  },

  update(token: string, id: number, input: UpdatePostInput) {
    return apiRequest<Post>(`/post/${id}`, { method: 'PUT', token, body: input });
  },

  remove(token: string, id: number) {
    return apiRequest<void>(`/post/${id}`, { method: 'DELETE', token });
  },

  thumbnailUrl(id: number, version?: string | number) {
    const url = `${API_BASE_URL}/post/${id}/thumbnail`;
    return version ? `${url}?v=${encodeURIComponent(String(version))}` : url;
  },

  uploadThumbnail(token: string, id: number, file: { uri: string; name: string; type: string }) {
    return apiUploadFile(`/post/${id}/thumbnail`, token, file);
  },
};
