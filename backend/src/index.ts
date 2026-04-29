import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { AppDataSource } from "./data-source";
import { setupRoutes } from "./routes";
dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json());
setupRoutes(app);


AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
