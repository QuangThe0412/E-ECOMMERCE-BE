// Customer interface (renamed from User to match database)
export interface Customer {
  Id: number;
  Name: string;
  Email: string;
  Phone?: string;
  Address?: string;
}

export interface CreateCustomerDTO {
  Name: string;
  Email: string;
  Phone?: string;
  Address?: string;
}

export interface UpdateCustomerDTO {
  Name?: string;
  Email?: string;
  Phone?: string;
  Address?: string;
}

// Keep User type for backward compatibility (authentication)
export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  role?: string;
  createdAt?: Date;
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
