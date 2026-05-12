import { GitRepository } from '../models/Repository';
import { AppDataSource } from '../data-source';

export const GitRepos = AppDataSource.getRepository(GitRepository).extend({})