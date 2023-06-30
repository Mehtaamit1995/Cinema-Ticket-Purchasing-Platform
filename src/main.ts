import express from 'express';
import { config } from 'dotenv';
import { join } from 'path';
import routes from './routes';

// <<-- Configure environment variables by loading them from the .env file -->>
config({ path: join(__dirname, '../.env') });

// <<-- Create the Express Application -->>
const app = express();
const port = process.env.PORT;

// <<-- Enabling Json Request body Parsing -->>
app.use(express.json());

// <<-- Use the routes defined in the separate routes.ts file -->>
app.use(routes);

// <<-- Start the Server -->>
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
