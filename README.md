# Jam Board

Jam Board is a work management application built with **Next.js** (App Router) for the frontend, and **Node.js** for the backend. It allows users to create boards, manage work items, and update their status (e.g., To Do, In Progress, In QA, Done). Users can also register, log in, and track their work items.

This README will guide you through the process of setting up your development environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Setup Environment Variables](#3-setup-environment-variables)
  - [4. Run the Application](#4-run-the-application)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Setup](#database-setup)
- [License](#license)

## Prerequisites

Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version >=16.x)
- [Yarn](https://yarnpkg.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [SQLite](https://www.sqlite.org/) (for local development)

## Setting Up the Development Environment

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/jam-board.git
cd jam-board
```

### 2. Install Dependencies

Install the required dependencies for both the frontend and backend using Yarn:

```bash
yarn install
```

This will install dependencies for both the **client** (frontend) and **server** (backend) directories.

### 3. Setup Environment Variables

Create `.env` files in both the root of the project and the `server/` directory to store sensitive environment variables, such as database credentials and JWT secrets.

#### `.env` (Root Directory)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000   # URL for the backend API
```

#### `.env` (Server Directory)

```env
DB_URL=sqlite:./dev.sqlite3               # SQLite database connection string
JWT_SECRET=your-jwt-secret                # Secret for signing JWT tokens
```

> You can adjust `DB_URL` to point to a different database if needed (e.g., PostgreSQL). This project is currently using **SQLite**.

### 4. Run the Application

#### Start Both Backend and Frontend

To start both the frontend and backend in development mode, we use `concurrently` to run both apps simultaneously.

Run the following command from the root directory:

```bash
yarn dev
```

This will:

- Start the **frontend** (Next.js) on `http://localhost:3000`
- Start the **backend** (Express/Node.js) on `http://localhost:5000`

Now you can access the app at `http://localhost:3000` in your browser.

---

## Project Structure

Here's an overview of the project structure:

```bash
jam-board/
├── client/              # Frontend (Next.js)
│   ├── app/             # App directory (Next.js)
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── public/          # Public assets (images, icons, etc.)
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── tsconfig.json    # TypeScript configuration for the frontend
├── server/              # Backend (Node.js + Express)
│   ├── models/          # Sequelize models (User, Board, WorkItem)
│   ├── routes/          # API routes for user authentication, boards, work items
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic for handling requests
│   └── tsconfig.json    # TypeScript configuration for the backend
├── .gitignore           # Git ignore file
├── README.md            # Project README
├── tsconfig.json        # Root TypeScript configuration
└── yarn.lock            # Yarn lock file
```

---

## Backend Setup

### Database

This project uses **Sequelize** with **SQLite** by default for local development, but the architecture allows easy migration to **PostgreSQL** later. The database models include **User**, **Board**, and **WorkItem**.

To sync the database and create the necessary tables, run the following command:

```bash
yarn db:migrate
```

This will create the tables defined in your Sequelize models.

### Authentication

- User authentication is handled via **JWT** tokens. After registering or logging in, a JWT token is generated and returned to the client for session management.

---

## Frontend Setup

The frontend is built using **Next.js (App Router)** and **Tailwind CSS** for styling. It provides a simple interface where users can register, log in, create boards, and manage work items.

---

## Database Setup

- The database used is **SQLite** for local development, defined in the `server/config/db.ts` file. If you want to migrate to **PostgreSQL**, you can modify the database connection URL in the `.env` file and update the Sequelize configurations accordingly.

To reset and recreate the database tables (use with caution in production), run:

```bash
yarn db:reset
```

This will drop the tables and re-sync them.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Let me know if you need to add or modify any sections! This should provide a good starting point for developers to get up and running with the project. 😊
