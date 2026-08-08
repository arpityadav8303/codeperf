import { BaseService } from "../core/lib/apiClient";

export class RepositoryService extends BaseService {
    private static instance: RepositoryService
    private constructor() {
        super();
    }
    public static getInstance(){
        if (!RepositoryService.instance) {
      RepositoryService.instance = new RepositoryService();
    }
    return RepositoryService.instance;
    }

    public async getAllRepo(){
        return this.get("/getAllRepo");
    }

    public async connectRepo(data: string){
        return this.post("/connectRepo", data)
    }

}