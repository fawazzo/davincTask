// frontend/src/types.ts
// Ensure these match your NestJS backend interfaces/DTOs
export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// DTOs for frontend requests (optional, but good practice for type safety)
export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<Omit<User, 'id'>>;

export type CreatePostDto = Omit<Post, 'id'>;
export type UpdatePostDto = Partial<Omit<Post, 'id'>>;