
export interface UserEntity {
    id: String;
    email: String;
    username: String;
}

export interface LoginRequest {
    email: String;
    password: String;
}

export interface AuthResponse {
    success: Boolean;
    token: String;
    user: UserEntity;
}

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}