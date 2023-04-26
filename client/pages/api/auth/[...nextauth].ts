import { clientTRPC } from "@/service/trpc";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SignInOptions } from "next-auth/react";

export const authOptions = {
	pages: {
		signIn: "/auth/signin",
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
		async signIn({ user }: SignInOptions) {
			const isAllowedToSignIn = true;
			if (isAllowedToSignIn) {
				// @ts-ignore
				await clientTRPC.user.create.mutate(user);
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
