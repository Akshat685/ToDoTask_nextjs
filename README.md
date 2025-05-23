# Full-Stack Todo List Application

This project is a full-stack Todo List Application built with **Next.js** for the frontend and **Node.js** with **Prisma** as the backend. The app follows a session-based user authentication system, ensuring that users can only access their own Todo lists. It includes login and signup routes, protected routes for user-specific data access, and the integration of **Apollo Client** for GraphQL queries. The frontend uses **TanStack Query** for data fetching and state management, with a clean and reusable code structure to maintain scalability and easy collaboration.

## Features and Functionalities


### User Authentication:

- **Sign Up**: Users can create a new account by providing a username and password. The password is hashed before being stored in the database for security.
- **Login**: Users can log in using their credentials. Upon successful authentication, a session cookie is set, allowing the user to stay logged in.
- **Session-based Authentication**: The app uses cookies to manage user sessions. Each session is stored on the server, and users must be authenticated to access protected routes.
- **Protected Routes**: Certain routes, such as those related to viewing or editing Todos, are protected and accessible only to authenticated users. Unauthorized users will be redirected to the login page.


### Todo List Management:

- **CRUD Operations**: Users can create, read, update, and delete their Todos.
- **View Todos**: Each user can only view their own Todos. The Todos are fetched securely from the server using a GraphQL query.
- **GraphQL**: The frontend communicates with the backend via Apollo Client, using GraphQL queries and mutations to fetch and update data.


## Frontend (Next.js):

- **Pages**: The app includes several pages:
  - **Home**: Displays the user's Todo list.
  - **Login**: A form for users to log in to their accounts.
  - **Signup**: A form for new users to create an account.
- **Apollo Client**: Apollo Client is used for managing data on the frontend. It communicates with the backend using GraphQL to handle Todo-related operations and user data.
- **TanStack Query**: Used for fetching data and managing server-side state in the frontend. It simplifies data caching, synchronization, and updates.


## Backend (Node.js with Prisma):

- **API Routes**: The backend exposes API routes that handle user authentication, session management, and Todo CRUD operations.
- **GraphQL Server**: A GraphQL server is set up using Apollo Server on the backend, where the queries and mutations for handling Todos and users are defined.
- **Prisma ORM**: Prisma is used for database management, with a SQL-based database to store user and Todo data.


## Code Structure:
Maintain a clean, code structure and reusability
