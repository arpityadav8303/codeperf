"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = require("express");
class AuthRoutes {
    constructor(router = (0, express_1.Router)(), controller = auth_controller_1.authController) {
        this.router = router;
        this.controller = controller;
    }
    getRoutes() {
        this.router.post("/register", (req, res) => this.controller.registerUser(req, res));
        return this.router;
    }
}
exports.AuthRoutes = AuthRoutes;
const authRoutes = new AuthRoutes();
exports.default = authRoutes.getRoutes();
//# sourceMappingURL=Auth.routes.js.map