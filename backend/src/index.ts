import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { AppDataSource } from "./data-source";
import { setupRoutes } from "./routes";
import { webSocketSubscribers } from "./config/websocket.config"
import { setupWebSocket } from './config/webSocket.setup';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(helmet());
// app.use(express.json());
app.use(helmet());
const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true 
};

app.use(cors(corsOptions));

// Configure express.json to capture the unparsed raw string specifically for GitHub signatures
app.use(
    express.json({
        verify: (req: any, res, buf) => {
            // Only capture raw body for incoming GitHub webhook requests
            if (req.originalUrl.includes('/api/v1/webhooks/github')) {
                req.rawBody = buf.toString('utf-8');
            }
        }
    })
);
setupRoutes(app);


AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        const PORT = process.env.PORT || 3001;
        const httpServer = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        setupWebSocket(httpServer);
        console.log(`WebSocket server ready on ws://localhost:${PORT}/ws`);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
