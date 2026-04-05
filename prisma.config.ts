import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:3306/placeholder",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
