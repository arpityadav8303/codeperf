import axios from "axios";

interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}

export const getGithubAccessToken = async (code: string) => {
    const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
        },
        { headers: { Accept: "application/json" } }
    );

    if (response.data.error || !response.data.access_token) {
        throw new Error(response.data.error_description || "GitHub did not return an access token");
    }

    return response.data.access_token as string;
};

export const getGithubUserProfile = async (accessToken: string) => {
    const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
};

export const getGithubPrimaryEmail = async (accessToken: string) => {
    const response = await axios.get<GitHubEmail[]>("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const primaryEmail = response.data.find((item) => item.primary && item.verified);
    const verifiedEmail = response.data.find((item) => item.verified);

    return primaryEmail?.email || verifiedEmail?.email || null;
};
