import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import BoxyHQSAMLProvider from "next-auth/providers/boxyhq-saml";
import * as dotenv from "dotenv";

dotenv.config({
	path: ".env",
});

export const authOptions: AuthOptions = {
	providers: [
		BoxyHQSAMLProvider({
			// set to entity id of idp (ping fed)
			issuer: "",
			clientId: "dummy",
			clientSecret: "dummy",
		}),
	],
	session: {
		// use jwt's so we dont need db
		strategy: "jwt",
	},
};

export function getSession() {
	return getServerSession(authOptions);
}

export default NextAuth(authOptions);
