// import { AppDataSource } from "../data-source";
import { AppDataSource } from "../data-source.postgres";
import { User } from "../models/User";

export const UserRepository = AppDataSource.getRepository(User).extend({});