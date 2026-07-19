import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { AppDataSource } from "./data-source";
import { setupRoutes } from "./routes";
import { setupWebSocket } from './config/webSocket.setup';
import "./worker/analysis.worker";
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

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodePerf Backend API',
      version: '1.0.0',
      description: 'API documentation for CodePerf benchmark and performance analysis engine',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: [__dirname + '/routes/*.ts', __dirname + '/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors(corsOptions));
app.get('/api-docs/swagger.json', (_req, res) => res.json(swaggerSpec));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
    express.json({
        verify: (req: any, res, buf) => {
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
