import { apiRequest } from '@/lib/api-client';
import { Category, CategoryInput } from '@/types/api';

export const categoryService = {
  list(token: string) {
    return apiRequest<Category[]>('/category', { token });
  },

  get(token: string, id: number) {
    return apiRequest<Category>(`/category/${id}`, { token });
  },

  create(token: string, input: CategoryInput) {
    return apiRequest<Category>('/category', { method: 'POST', token, body: input });
  },

  update(token: string, id: number, input: Partial<CategoryInput>) {
    return apiRequest<Category>(`/category/${id}`, { method: 'PUT', token, body: input });
  },

  remove(token: string, id: number) {
    return apiRequest<void>(`/category/${id}`, { method: 'DELETE', token });
  },
};
