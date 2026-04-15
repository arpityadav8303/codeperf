import { UserRepository } from "../repositiory/auth.controller.repo";
import { User } from "../models/User";
export class UserService{
    constructor(private userRepo = UserRepository) {}

    registerUser = async (user: User) => {
    return await this.userRepo.save(user);
    }

   async loginUser(email: string) {
    return await this.userRepo.findOneBy({ email }); 
    }   
}

