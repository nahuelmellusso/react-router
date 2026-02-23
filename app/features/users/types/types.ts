export type CreateUserPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

type CreateUserOptions = {
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
};
export type User = {
  id: string | number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  position: string;
};

export type UsersQueryParams = {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: "name" | "email" | "createdAt";
  sortDir?: "asc" | "desc";
};

export type Paginated<T> = {
  data: T[];
  meta?: {
    page: number;
    perPage: number;
    total: number;
    totalPages?: number;
  };
};
