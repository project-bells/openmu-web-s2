import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";
import { getAdminPassword } from "./siteConfig";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET || "openmu-default-secret-key",
    pages: {
        signIn: ""
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if(!credentials?.username || !credentials?.password){
                return null;
            }
            const cleanUsername = credentials.username.trim();
            if (cleanUsername.toLowerCase() === "admin") {
                const adminPassword = getAdminPassword();
                if (credentials.password === adminPassword) {
                    return {
                        id: "00000000-0000-0000-0000-000000000000",
                        username: "admin",
                        email: "admin@muorigins.local",
                        role: "GAME_MASTER"
                    };
                }
            }
            const existingUser = await prisma.account.findUnique({
                where: {
                    LoginName: cleanUsername
                }
            })
            if(!existingUser) {
                return null;
            }
            const passwordMatch = await compare(credentials.password, existingUser.PasswordHash)
            if(!passwordMatch){
                return null;
            }
            //find if there is any character that has a GM status
            const isGm = (await prisma.character.findMany({
                where: {
                    AccountId: {
                        equals: existingUser.Id
                    }
                }
            })).some(c => c.CharacterStatus === 32);
            return {
                id: existingUser.Id,
                username: existingUser.LoginName,
                email: existingUser.EMail,
                role: isGm ? "GAME_MASTER" : "USER"
            }
        }
    })
    ],
    callbacks: {
          async jwt({ token, user }) {
            if(user) {
                return {
                    ...token,
                    username: user.username,
                    id: user.id,
                    role: user.role
                }
            }
            return token
          },
          async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    role: token.role
                },
            }
          },
    }
}