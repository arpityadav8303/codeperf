import { GitRepository } from '../models/Repository';
import { AppDataSource } from "../data-source.postgres";

export const GitRepos = AppDataSource.getRepository(GitRepository).extend({})