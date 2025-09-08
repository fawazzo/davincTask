# Backend (NestJS) Web Development Assignment

This is the backend portion of the web development assignment, built with NestJS, TypeScript, and Express. It provides RESTful API endpoints for managing users and posts with hardcoded initial data.

## Technologies Used .

*   **NestJS:** A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
*   **TypeScript:** A typed superset of JavaScript.
*   **Express:** (Underneath NestJS) A fast, unopinionated, minimalist web framework for Node.js.
*   **ESLint:** For maintaining code quality and consistency.
*   **Class-Validator / Class-Transformer:** For request payload validation and transformation.

## Features

*   **User Management (`/users`):**
    *   `GET /users`: Retrieve all users.
    *   `GET /users/:id`: Retrieve a single user by ID.
    *   `POST /users`: Create a new user.
    *   `PUT /users/:id`: Update an existing user by ID.
    *   `DELETE /users/:id`: Delete a user by ID.
*   **Post Management (`/posts`):**
    *   `GET /posts`: Retrieve all posts.
    *   `GET /posts?userId={id}`: Retrieve posts by a specific user ID.
    *   `GET /posts/:id`: Retrieve a single post by ID.
    *   `POST /posts`: Create a new post.
    *   `PUT /posts/:id`: Update an existing post by ID.
    *   `DELETE /posts/:id`: Delete a post by ID.
*   **Hardcoded Data:** Initial data for users and posts is stored in memory within the services (no database required).
*   **Validation:** Request bodies are validated using DTOs and `class-validator`.
*   **CORS Enabled:** Configured to allow requests from the frontend application (e.g., `http://localhost:5173`).
*   **ESLint Compliance:** Code adheres to NestJS's default ESLint rules.

## Setup and Run

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd web-dev-assignment/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run start:dev
    ```
    The application will typically be available at `http://localhost:3000` (or another port if configured).

4.  **Build for production (optional):**
    ```bash
    npm run build
    ```
    This will compile TypeScript files to JavaScript in the `dist` directory. To run the production build:
    ```bash
    npm run start:prod
    ```

## API Endpoints (Example with `curl` or Postman)

### Users

*   **Get all users:**
    `GET http://localhost:3000/users`
*   **Get user by ID (e.g., ID 1):**
    `GET http://localhost:3000/users/1`
*   **Create a new user:**
    `POST http://localhost:3000/users`
    Body (JSON):
    ```json
    {
        "name": "Jane Doe",
        "username": "janedoe",
        "email": "jane.doe@example.com",
        "address": {
            "street": "Eliza Street",
            "suite": "Apt. 123",
            "city": "Metropolis",
            "zipcode": "12345-6789",
            "geo": { "lat": "40.1234", "lng": "-74.5678" }
        },
        "phone": "1-234-567-8901",
        "website": "janedoe.org",
        "company": {
            "name": "Acme Corp",
            "catchPhrase": "Innovate everything",
            "bs": "synergize frictionless paradigms"
        }
    }
    ```
*   **Update user by ID (e.g., ID 1):**
    `PUT http://localhost:3000/users/1`
    Body (JSON - partial update also works via `UpdateUserDto` but here's full example):
    ```json
    {
        "name": "Leanne Graham-Updated",
        "email": "updated@april.biz"
    }
    ```
*   **Delete user by ID (e.g., ID 1):**
    `DELETE http://localhost:3000/users/1`

### Posts

*   **Get all posts:**
    `GET http://localhost:3000/posts`
*   **Get posts by User ID (e.g., userId 1):**
    `GET http://localhost:3000/posts?userId=1`
*   **Get post by ID (e.g., ID 1):**
    `GET http://localhost:3000/posts/1`
*   **Create a new post:**
    `POST http://localhost:3000/posts`
    Body (JSON):
    ```json
    {
        "userId": 1,
        "title": "My New Post Title",
        "body": "This is the content of my brand new post created via the API."
    }
    ```
*   **Update post by ID (e.g., ID 1):**
    `PUT http://localhost:3000/posts/1`
    Body (JSON):
    ```json
    {
        "title": "Updated Post Title",
        "body": "The body of the post has been updated."
    }
    ```
*   **Delete post by ID (e.g., ID 1):**
    `DELETE http://localhost:3000/posts/1`

## Folder Structure