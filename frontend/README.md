# Frontend (React + Vite) Web Development Assignment

This is the frontend portion of the web development assignment, built with React, TypeScript, and Vite. It demonstrates fetching data from `jsonplaceholder.typicode.com`, displaying lists of users and posts, and providing conceptual CRUD operations.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite:** A fast build tool that provides an extremely quick development experience.
*   **React Router DOM:** For declarative routing in React applications.
*   **ESLint:** For maintaining code quality and consistency.

## Features

*   **Homepage:** Simple navigation to Users and Posts lists.
*   **User List:** Displays `id`, `name`, `username`, and `email` for each user.
*   **Post List:** Displays `id`, `userId`, and `title` for each post.
*   **Detail Views:**
    *   **User Detail:** Shows full user details and lists all posts by that user.
    *   **Post Detail:** Shows full post details and links to the author's page.
*   **Conceptual CRUD Operations:**
    *   **Create (Simulated):** Links to `/users/new` and `/posts/new` are present, but actual creation is only simulated in Phase 1 due to using a read-only external API.
    *   **Read:** Displaying lists and individual details.
    *   **Update (Simulated):** Edit forms are provided on detail pages, but changes are only applied to local state and an alert is shown.
    *   **Delete (Simulated):** Delete buttons are present, triggering a confirmation and an alert message.
*   **Basic Styling:** Minimalist design for readability and user experience.
*   **ESLint Compliance:** Code adheres to ESLint rules for TypeScript and React.

## Setup and Run

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd web-dev-assignment/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (or another port specified by Vite).

4.  **Build for production (optional):**
    ```bash
    npm run build
    ```
    This will generate optimized static assets in the `dist` directory.

## Linting

To check for ESLint issues:

```bash
npm run lint