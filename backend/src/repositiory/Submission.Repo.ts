import { AppDataSource } from "../data-source";
import { Submission } from "../models/Submission";

export const SubmissionRepository = AppDataSource.getRepository(Submission).extend({
});