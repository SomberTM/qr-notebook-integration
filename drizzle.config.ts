import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: ".env.local",
});

if (!process.env.CONNECTION_STRING)
	throw new Error("Environment variable not set: 'CONNECTION_STRING'");

export default defineConfig({
	schema: "./src/db/schema/*",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.CONNECTION_STRING,
	},
});
