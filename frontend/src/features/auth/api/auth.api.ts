import { BaseService } from "../../../core/lib/apiClient";
import type { LoginRequest, AuthResponse, SignUpRequest, verifyOtp, ChangePasswordPayload} from "../types/auth.types";
export class AuthService extends BaseService {
    private static instance: AuthService;

    private constructor() {
        super();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(credentials: LoginRequest): Promise<AuthResponse> {
        return this.post<AuthResponse>("/auth/login", credentials);
    }

    public async register(credentials: SignUpRequest): Promise<AuthResponse> {
        return this.post<AuthResponse>("/auth/register", credentials);
    }

    public async getMe(): Promise<any> {
        return this.get<any>("/auth/me");
    }

    public async sendOTP(credential:{email: string}): Promise<any> {
        return this.post("/auth/send-otp", credential);
    }

    public async verifyOtp(credential: verifyOtp): Promise<any> {
        return this.post("/auth/verify-otp", credential);
    }

    public async resetPassword(credential: {password: string, resetToken: string}): Promise<any> {
        return this.post("/auth/reset-password", credential);
    }

    public async changePassword(credential: ChangePasswordPayload): Promise<any> {
        return this.put("auth/change-password", credential);
    }
}