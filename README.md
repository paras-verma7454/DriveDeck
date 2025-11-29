# DriveDeck

This is a full-stack application for managing vehicles, likely for a car dealership or similar service.

## Project Structure

- `backend/`: Contains the Node.js/Express backend with Prisma for database interaction.
- `frontend/`: Contains the React.js frontend application.

## Getting Started

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add your database URL. For example:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
    ```
    (Ensure PostgreSQL is running and accessible.)

4.  **Run Prisma migrations:**
    ```bash
    npx prisma migrate dev --name init
    ```
    This will create the necessary tables in your database.

5.  **Build the project:**
    ```bash
    npm run build
    ```

6.  **Start the development server:**
    ```bash
    npm run dev
    ```
    
### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend application should now be running, typically on `http://localhost:5173` (or as configured by Vite).

## Environment Variables

The frontend may require additional environment variables. Check the `frontend/.env` file or `frontend/vite.config.ts` for details.