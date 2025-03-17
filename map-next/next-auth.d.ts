import NextAuth from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      // _id:string;
      id: string;
      name: string;
      email: string;
      token: string;
    };
  }
  interface User extends DefaultUser {
    id: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    token: string;
    name: string;
    email: string;
  }
}
