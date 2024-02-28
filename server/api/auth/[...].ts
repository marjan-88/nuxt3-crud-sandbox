import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github'
import { User } from "~/server/models/User";
import bcrypt from "bcrypt";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,

  pages: {
    signIn: "/register",
  },

  providers: [
   
    // GoogleProvider.default({
    //   clientId: useRuntimeConfig().googleId,
    //   clientSecret: useRuntimeConfig().googleSecret,      
    // }),

     // @ts-expect-error
    CredentialsProvider.default({
      name: "credentials",
      credentials: {},
      async authorize(credentials: { name: string; password: string }) {

        const user = await User.findOne({ name: credentials.name });

        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }       

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }

        return {
          ...user.toObject(),
          password: undefined,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...token,
        ...session.user,
      };

      return session;
    },
  },
});