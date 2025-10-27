export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
  role?: string;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
}
