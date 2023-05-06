// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";
const request = require("request");

type Data = {
	name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	let refreshToken = getCookie("spotify_refresh_token", { req, res });

	var authOptions = {
		url: "https://accounts.spotify.com/api/token",
		headers: {
			Authorization:
				"Basic " +
				Buffer.from(
					process.env.SPOTIFY_ID + ":" + process.env.SPOTIFY_SECRET
				).toString("base64"),
		},
		form: {
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		},
		json: true,
	};

	//@ts-ignore
	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			setCookie("spotify_access_token", access_token, {
				req,
				res,
				maxAge: 60 * 60,
			});
			res.redirect(req.headers.referer as string)
		}
	});
}
