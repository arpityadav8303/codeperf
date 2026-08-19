import axios from "axios";
import fs from "fs";
import jwt from "jsonwebtoken";
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

export const generateGithubAppJWT = (): string => {
    const privateKey = fs.readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH!, "utf8");
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign(
        {
            iat: now - 60,
            exp: now + 9 * 60,
            iss: process.env.AppID,
        },
        privateKey,
        {
            algorithm: "RS256",
        }
    );
};
export const getInstallationAccessToken = async (installationId: string): Promise<string> => {

    const appJwt = generateGithubAppJWT();

    const response = await axios.post(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {},
        {
            headers: {
                Authorization: `Bearer ${appJwt}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    return response.data.token;
};

export const getGithubRepositories = async (installationToken: string) => {
    const response = await axios.get(
        "https://api.github.com/installation/repositories",
        {
            headers: {
                Authorization: `Bearer ${installationToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    return response.data.repositories.map((repo: any) => ({
        githubRepoId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        language: repo.language,
        defaultBranch: repo.default_branch,
        htmlUrl: repo.html_url,
        avatar: repo.owner.avatar_url
    }));
};

export const getGithubReposForInstallation = async (installationId: string) => {
    const installationToken = await getInstallationAccessToken(installationId);

    const repositories =
        await getGithubRepositories(installationToken);

    return repositories;
};
