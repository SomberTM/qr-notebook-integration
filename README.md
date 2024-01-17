Steps to run

- Make sure you have pnpm installed.
- Make sure you have node version +18.17.0

1. Clone the repo to your local machine
2. cd into the repo
3. Install packages with `pnpm install`

Setup database

1. If you haven't already create a file called `.env.local`
2. Set `CONNECTION_STRING="<insert-postgresql-connection-string>"`
3. Run `pnpm run dbpush`. This will simply push the current schema to the database overwriting an existing tables.

Finally,
`pnpm run dev`

Navigate to `localhost:3000` in your browser
