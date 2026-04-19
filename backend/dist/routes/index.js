"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const Auth_routes_1 = __importDefault(require("./Auth.routes"));
function registerRoutes(app) {
    app.use("/auth", Auth_routes_1.default);
    app.get("/health", (req, res) => {
        res.json({ success: true, message: "CodePerf API is running" });
    });
}
//# sourceMappingURL=index.js.map