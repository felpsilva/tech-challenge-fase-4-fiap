export type Permission = 'admin' | 'professor' | 'aluno' | string;

export interface AuthSession {
  token: string;
  user: {
    id: number;
    username: string;
    permission: Permission;
  };
}

export interface SignInResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  permission: Permission;
  created_at?: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  permission: Permission;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  permission?: Permission;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  image_url?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  categories?: Category[];
  user?: User;
  author?: User;
}

export interface CreatePostInput {
  user_id: number;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  status?: string;
  categories?: (Pick<Category, 'id'> & Partial<Pick<Category, 'name' | 'slug'>>)[];
}

export type UpdatePostInput = Partial<
  Omit<CreatePostInput, 'user_id'>
>;

export interface ApiErrorBody {
  message?: string;
}
