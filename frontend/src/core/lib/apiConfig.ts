const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

export const getApiBaseUrl = () => {
    const rawUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

    if (/\/api\/v\d+$/i.test(rawUrl)) {
        return rawUrl;
    }

    if (/\/api$/i.test(rawUrl)) {
        return `${rawUrl}/v1`;
    }

    return rawUrl;
};

export const API_BASE_URL = getApiBaseUrl();
export const getGithubOAuthUrl = () => `${API_BASE_URL}/auth/github`;
