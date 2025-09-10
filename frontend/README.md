# Frontend (React + Vite) Web Development Assignment

This is the frontend portion of the web development assignment, built with React, TypeScript, and Vite. It interacts with a dedicated NestJS backend (deployed at `https://davinctask.onrender.com`) to provide full CRUD operations for users and posts.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite:** A fast build tool that provides an extremely quick development experience.
*   **React Router DOM:** For declarative routing in React applications.
*   **Axios:** A promise-based HTTP client for making API requests.
*   **ESLint:** For maintaining code quality and consistency.

## Features

*   **Homepage:** Simple navigation to Users and Posts lists.
*   **User List:** Displays `id`, `name`, `username`, and `email` for each user. Includes a link to create a new user.
*   **Post List:** Displays `id`, `userId`, and `title` for each post. Includes a link to create a new post.
*   **Detail Views with Full CRUD:**
    *   **User Detail (`/users/:id`):**
        *   Shows full user details.
        *   Lists all posts by that user, with links to individual post details.
        *   **Edit Functionality:** Allows updating existing user information (name, username, email, address, company details).
        *   **Delete Functionality:** Allows deleting a user.
    *   **Post Detail (`/posts/:id`):**
        *   Shows full post details.
        *   Displays the post's author, with a link to the author's user detail page.
        *   **Edit Functionality:** Allows updating existing post information (title, body, userId).
        *   **Delete Functionality:** Allows deleting a post.
    *   **Create Functionality (`/users/new`, `/posts/new`):**
        *   Provides forms to create new users and posts, which are then persisted to the backend.
*   **Backend Integration:** All data fetching and manipulation (Create, Read, Update, Delete) are performed by making API calls to the NestJS backend.
*   **Basic Styling:** Minimalist design for readability and user experience.
*   **ESLint Compliance:** Code adheres to ESLint rules for TypeScript and React.

## Setup and Run

This frontend application is designed to work with the companion backend. Ensure the backend is running or accessible at `https://davinctask.onrender.com`.

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd davincTask/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (or another port specified by Vite). It will automatically connect to the deployed backend.

4.  **Build for production (optional):**
    ```bash
    npm run build
    ```
    This will generate optimized static assets in the `dist` directory.

## Linting

To check for ESLint issues:

```bash
npm run lint