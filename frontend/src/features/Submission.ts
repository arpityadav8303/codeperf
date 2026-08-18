import { BaseService } from "../core/lib/apiClient";
 export interface Submission {
  id: string;
  code: string;
  language: string;
  status: string;
  detectedComplexity: string;
  confidence: number;
  createdAt: string;
}

export interface SubmissionResponse {
  success: boolean;
  data: {
    success: boolean;
    data: Submission[];
    total: number;
    offset: number;
    totalPages: number;
    message: string;
  };
}

export interface SubmissionListParams {
  page: number;
  limit: number;
  language?: string;
  complexity?: string;
}

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
    inputSize: number;
  }) {
    return this.post("/submission/create-submission", data);
  }

  public async getBenchmark(id: string) {
    return this.get(`/submission/get-Submission-With-Benchmark/${id}`);
  }

  public async getAllSubmissions({ page, limit, ...filters }: SubmissionListParams) {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)
    );

    return this.get<SubmissionResponse>("/submission/get-all-Submissions", {
      params: { page, limit, ...activeFilters },
    });
  }

}
