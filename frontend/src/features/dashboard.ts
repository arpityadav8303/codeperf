import { BaseService } from "../core/lib/apiClient";

export class DashboardService extends BaseService{
private static instance: DashboardService;
private constructor() {
    super();
  }
  public static getInstance() {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }
  public async getDashboardData():Promise<any> {
    return this.get('/dashboard/get-user-details')
  }
}