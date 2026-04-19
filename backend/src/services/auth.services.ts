import { UserRepository } from "../repositiory/auth.controller.repo";
import { User } from "../models/User";
import bcrypt from 'bcrypt'
export class UserService{
    constructor(private userRepo = UserRepository) {}

     async register({ name, email, password }: any) {

        if (!email || !password) {
            throw { status: 400, message: "Email and password required" };
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await this.userRepo.findOne({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            throw { status: 409, message: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepo.create({
            name: name || null,
            email: normalizedEmail,
            passwordHash: hashedPassword
        });

        await this.userRepo.save(user);

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };

    }
    async findOne(condition:any) {
        return await this.userRepo.findOneBy(condition);
    }
    async find(condition:any){
        return await this.userRepo.find(condition);
    }
    async create(user:User){
        return await this.userRepo.save(user);
    }
    async update(id:string,user:User){
        return await this.userRepo.update(id,user);
    }
    async delete(id:string){
        return await this.userRepo.delete(id);
    }
}

