import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function normalizeColumnName(name: string) {
	return name.toLowerCase().replaceAll(" ", "_");
}
