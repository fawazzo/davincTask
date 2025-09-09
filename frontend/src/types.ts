// frontend/src/types.ts

// --- Core Interfaces (These typically mirror your backend interfaces/models 1:1) ---
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

// --- Frontend DTOs for Create Operations (These are generally fine) ---
// For creating a user, we omit the 'id' as the backend generates it.
export type CreateUserDto = Omit<User, 'id'>;

// For creating a post, we omit the 'id' as the backend generates it.
export type CreatePostDto = Omit<Post, 'id'>;


// --- Frontend DTOs for Update Operations (These are what you need to change!) ---

// 1. Helper Interfaces for partial nested updates (User)
//    These reflect the `*UpdateDto` classes on your backend.
export interface GeoUpdate {
  lat?: string; // Optional field
  lng?: string; // Optional field
}

export interface AddressUpdate {
  street?: string;  // Optional field
  suite?: string;   // Optional field
  city?: string;    // Optional field
  zipcode?: string; // Optional field
  geo?: GeoUpdate;  // Optional 'geo' object, which itself can have optional fields
}

export interface CompanyUpdate {
  name?: string;        // Optional field
  catchPhrase?: string; // Optional field
  bs?: string;          // Optional field
}

// 2. Main UpdateUserDto (Frontend-side)
//    This MUST accurately reflect the *payload* you send and what your
//    backend's `UpdateUserDto` *class* ultimately expects after validation.
export interface UpdateUserDto {
  // Add 'id' because your frontend's `editedUser` will contain it
  // and send it in the PUT request body, and your backend's `UpdateUserDto`
  // needs to whitelist it with `@IsOptional() @IsNumber() id?: number;`
  id?: number;

  name?: string;     // Top-level fields are optional
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  
  // Use the specific partial update interfaces for nested objects
  address?: AddressUpdate; // The 'address' object itself is optional
  company?: CompanyUpdate; // The 'company' object itself is optional
}


// 3. UpdatePostDto (Frontend-side)
//    This MUST accurately reflect the payload you send for post updates.
export interface UpdatePostDto {
  // Add 'id' because your frontend's `editedPost` will contain it
  // and send it in the PUT request body, and your backend's `UpdatePostDto`
  // needs to whitelist it with `@IsOptional() @IsNumber() id?: number;`
  id?: number;

  userId?: number; // Optional
  title?: string;  // Optional
  body?: string;   // Optional
}