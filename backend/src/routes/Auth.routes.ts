import { authController } from "../controllers/auth.controller";
import { Router } from "express";

export class AuthRoutes {
    constructor(private router = Router(), private controller = authController) {}


    getRoutes() {
        this.router.post("/register", (req, res) => this.controller.registerUser(req, res));
        return this.router;
    }
}

const authRoutes = new AuthRoutes();
export default authRoutes.getRoutes();
