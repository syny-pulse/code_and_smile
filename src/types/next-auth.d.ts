import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: "ADMIN" | "TUTOR" | "LEARNER" | "APPLICANT";
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: "ADMIN" | "TUTOR" | "LEARNER" | "APPLICANT";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: "ADMIN" | "TUTOR" | "LEARNER" | "APPLICANT";
  }
}