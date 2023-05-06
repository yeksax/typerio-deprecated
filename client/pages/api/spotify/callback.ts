// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import queryString from "query-string";
const request = require("request");

type Data = {
	name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	var code = req.query.code || null;
	var state = req.query.state || null;

	if (state === null) {
		res.redirect(
			"/#" +
				queryString.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		var authOptions = {
			url: "https://accounts.spotify.com/api/token",
			form: {
				code: code,
				redirect_uri: "http://localhost:3000/api/spotify/callback",
				grant_type: "authorization_code",
			},
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(
						process.env.SPOTIFY_ID +
							":" +
							process.env.SPOTIFY_SECRET
					).toString("base64"),
			},
			json: true,
		};

		// @ts-ignore
		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token,
					refresh_token = body.refresh_token;

				// we can also pass the token to the browser to make requests from there
				res.redirect(
					"/api/spotify/sucess?" +
						queryString.stringify({
							access_token: access_token,
							refresh_token: refresh_token,
							callback_uri: "/user/me",
						})
				);
			}
		});
	}
}
