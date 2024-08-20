import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "~/server/models/User";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoose from "mongoose";

// Konwertuj mongoose.connection na MongoClient
const clientPromise = mongoose.connection.getClient();
export default NuxtAuthHandler({
	secret: useRuntimeConfig().authSecret,
	pages: {
		signIn: "/register",
		signOut: "/authPages/loggedOut",
	},
	// @ts-expect-error
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		// @ts-expect-error
		GoogleProvider.default({
			clientId: useRuntimeConfig().googleId,
			clientSecret: useRuntimeConfig().googleSecret,
		}),
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
			// Check if this is a new user and create them in the database
			if (account && user) {
				const existingUser = await User.findOne({ email: user.email });
				if (!existingUser) {
					const newUser = new User({
						name: user.name,
						email: user.email,
						image: user.image,
						provider: account.provider,
					});
					await newUser.save();
					token.userId = newUser._id;
				} else {
					token.userId = existingUser._id;
				}
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
	events: {
		async signIn(message) {
			console.log('SIGN IN MESSAGE');
		
		},
		async signOut(message) {
			console.log('SIGN OUT MESSAGE');		
		},
	},
});
