import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
//import mysql2 from 'mysql2';
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();
app.use(express.json());

// const connection=mysql2.createConnection({
//   host:process.env.DB_HOST,
//   user:process.env.DB_USER,
//   password:process.env.DB_PASSWORD,
//   database:process.env.DB_NAME
// })

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to MySQL Database!');
// });

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'CodePerf API is running' });
});

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
