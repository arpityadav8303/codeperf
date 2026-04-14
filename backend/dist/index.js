"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
//import mysql2 from 'mysql2';
const data_source_1 = require("./data-source");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
data_source_1.AppDataSource.initialize()
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
//# sourceMappingURL=index.js.map