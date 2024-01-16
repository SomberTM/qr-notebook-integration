import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
	connectionString: process.env.CONNECTION_STRING,
});

client.connect();
export default drizzle(client, {
	schema,
});
