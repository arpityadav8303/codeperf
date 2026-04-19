"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const auth_controller_repo_1 = require("../repositiory/auth.controller.repo");
class UserService {
    constructor(userRepo = auth_controller_repo_1.UserRepository) {
        this.userRepo = userRepo;
    }
    async findOne(condition) {
        return await this.userRepo.findOneBy(condition);
    }
    async find(condition) {
        return await this.userRepo.find(condition);
    }
    async create(user) {
        return await this.userRepo.save(user);
    }
    async update(id, user) {
        return await this.userRepo.update(id, user);
    }
    async delete(id) {
        return await this.userRepo.delete(id);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=auth.services.js.map