import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { mockDb } from "./mock-db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Accept ANY credentials as dummy prototype user
        // But check if it exists in mockDb first
        let user = mockDb.users.find(u => u.email === credentials.email);
        
        if (!user) {
          // Auto-create dummy user for prototype
          user = {
            id: Math.random().toString(36).substring(7),
            email: credentials.email,
            name: "Dummy User",
            role: "user",
            company: "Prototype Inc."
          };
          mockDb.users.push(user);
        }

        return user as any;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).company = token.company;
      }
      return session;
    }
  },
  pages: {
    signIn: "/pages/signin"
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-for-prototype"
};
