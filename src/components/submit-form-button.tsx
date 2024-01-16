"use client";

import { Button } from "./ui/button";
import React from "react";

export function SubmitButton({
	children,
	loading,
	loadingValue = "Loading...",
	disabled,
	...props
}: {
	loading: boolean;
	loadingValue: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
	return (
		<Button {...props} disabled={disabled || loading} type="submit">
			{loading ? loadingValue : children}
		</Button>
	);
}
