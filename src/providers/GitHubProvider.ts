export interface IGitHubAccountApiDTO {
	login: string;
	bio: string;
	html_url: string;
	avatar_url: string;
}

export interface IGitHubAccountInfoDTO {
	username: string;
	bio: string;
	git: string;
	cover_url: string;
}

export interface IGitHubProvider {
	getUserInfo(username: string): Promise<IGitHubAccountInfoDTO | null>;
}

export class GitHubProvider implements IGitHubProvider {
	private BASE_URL = "https://api.github.com/users/{username}";

	async getUserInfo(username: string): Promise<IGitHubAccountInfoDTO | null> {
		const url = this.BASE_URL.replace("{username}", username);
		const response = await fetch(url);
		if (!response.ok) return null;
		const data = await response.json();
		if (!this.isGitHubAccount(data)) return null;
		const { login, avatar_url, bio, html_url } = data;
		return {
			username: login,
			cover_url: avatar_url,
			git: html_url,
			bio,
		};
	}

	private isGitHubAccount(data: unknown): data is IGitHubAccountApiDTO {
		return typeof data === "object" && data !== null && "id" in data && "login" in data;
	}
}
