import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SignInOptions } from "next-auth/react";
require("dotenv").config();

export const authOptions = {
	pages: {
		signIn: "/login"
	},
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
		}),
	],
	callbacks: {
		async signIn({
			user,
		}: SignInOptions) {
			const isAllowedToSignIn = true;
			if (isAllowedToSignIn) {
				await fetch("http://localhost:3001/user/create", {
					method: "POST",
					body: JSON.stringify(user),
					headers: {
						"Content-Type": "application/json",
					},
				});

				return true;
			} else {
				// Return false to display a default error message
				return false;
				// Or you can return a URL to redirect to:
				// return '/unauthorized'
			}
		},
	},
};

export default NextAuth(authOptions);
