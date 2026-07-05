export interface UserEntity {
    id: string;
    email: string | null;
    name?: string | null;
    username?: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    data?: UserEntity;
    message?: string;
}

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

export interface verifyOtp {
    otp: string
    email: string
}
