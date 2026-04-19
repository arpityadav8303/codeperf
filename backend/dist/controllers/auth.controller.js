"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.UserAuth = void 0;
const auth_services_1 = require("../services/auth.services");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserAuth {
    constructor(userService = new auth_services_1.UserService()) {
        this.userService = userService;
    }
    async registerUser(req, res) {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const existingUser = await this.userService.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await this.userService.create({
            name,
            email,
            passwordHash: hashedPassword
        });
        return res.status(201).json({
            message: "User registered successfully",
            user
        });
    }
}
exports.UserAuth = UserAuth;
exports.authController = new UserAuth();
//# sourceMappingURL=auth.controller.js.map