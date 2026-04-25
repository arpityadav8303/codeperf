import { User } from "../models/User";
import { Repository } from "typeorm";

export class UserRepository extends Repository<User> {
}