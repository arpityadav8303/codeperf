import { BaseService } from "../core/lib/apiClient";

export class SubmissionService extends BaseService {
  private static instance: SubmissionService;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!SubmissionService.instance) {
      SubmissionService.instance = new SubmissionService();
    }
    return SubmissionService.instance;
  }

  public async createSubmission(data: {
    code: string;
    language: string;
  }) {
    return this.post("/submission/create-submission", data);
  }

  public async getBenchmark(id: string) {
    return this.get(`/submission/get-Submission-With-Benchmark/${id}`);
  }
}