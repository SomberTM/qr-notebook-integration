"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export function InitiateSignIn() {
	return (
		<Button
			onClick={(e) => {
				e.preventDefault();
				signIn("boxyhq-saml", {}, { tenant: "merck.com", product: "" });
			}}
		>
			Sign In
		</Button>
	);
}
