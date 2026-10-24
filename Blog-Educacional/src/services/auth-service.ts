import { apiRequest } from '@/lib/api-client';
import { CreateUserInput, SignInResponse, UpdateUserInput, User } from '@/types/api';

export const authService = {
  signIn(username: string, password: string) {
    return apiRequest<SignInResponse>('/user/signin', {
      method: 'POST',
      body: { username, password },
    });
  },
};

export const userService = {
  list(token: string) {
    return apiRequest<User[]>('/user', { token });
  },

  get(token: string, id: number) {
    return apiRequest<User>(`/user/${id}`, { token });
  },

  create(token: string, input: CreateUserInput) {
    return apiRequest<User>('/user', { method: 'POST', token, body: input });
  },

  update(token: string, id: number, input: UpdateUserInput) {
    return apiRequest<User>(`/user/${id}`, { method: 'PUT', token, body: input });
  },

  remove(token: string, id: number) {
    return apiRequest<void>(`/user/${id}`, { method: 'DELETE', token });
  },
};
