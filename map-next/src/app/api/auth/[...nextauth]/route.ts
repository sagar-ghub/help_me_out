import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiRequest } from "../../../lib/api"; // adjust path as needed

const handler= NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "johndoe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        // console.log(credentials)

        // Call your dedicated backend API using your apiRequest utility
        const response = await apiRequest<{
          status: string;
          data?: string; // backend token
          error?: string;
          userId?: string;
          username?: string;
          email?: string;
        }>(
          "/login",
          "POST",
          {
            username: credentials.username,
            password: credentials.password,
          }
        );

        if (response.status === "ok" && response.data) {
          // localStorage.setItem("token",response.data)
          return {
            id: response.userId || "",
            // name: response.username || credentials.username,
            // email: response.email || "no-email@example.com",
            token: response.data, // your backend token
          };
        }

        throw new Error(response.error || "Login failed");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When user is defined on login, attach additional data to token
      if (user) {
        console.log("userrrrrrrrrrr",user)
        token.id = user.id;
        token.token = user.token;
        // token.name = user.name;
        // token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure session.user contains our custom fields
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        token: token.token as string,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/chat',
    signOut: '/login',
    error: '/login',
  },
});

export {handler as GET, handler as POST}