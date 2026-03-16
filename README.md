# Final Year Project (My Garage)

Welcome to the Next.js project! This guide will walk you through the steps to set up and run the project locally on your machine.

---

## **Prerequisites**

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js) or [Yarn](https://yarnpkg.com/) (optional)
- [Git](https://git-scm.com/) (for cloning the repository)

---

## **Getting Started**

### 1. **Clone the Repository**

First, clone the project repository to your local machine:

```bash
git clone https://github.com/mardan-shah/final-year-project
```

### 2. Navigate to the Project Directory

Move into the project folder:
```bash
cd my-app
```

### 3. Install Dependencies

Install the required dependencies using npm or Yarn:
Using npm:
```bash
npm install
```

### 4. Database & Auth Setup

1. Set up a PostgreSQL database.
2. Create a `.env` file in the root directory with:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

### 5. Run the project
```bash
npm run dev
```
