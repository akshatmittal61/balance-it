export const oauth_google = Object.freeze({
	client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
	client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
	redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || "",
});
