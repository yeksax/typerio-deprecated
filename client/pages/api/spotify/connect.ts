// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import queryString from "query-string";

type Data = {
	name: string;
};

const possible =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRandomString(length: number): string {
	let str = ""
  for (let i = 0; i < length; i++) {
    str+= possible[Math.floor(Math.random() * possible.length)]
  }
	return str;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	var state = generateRandomString(16);
	var scope = "user-read-currently-playing";

	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			queryString.stringify({
				response_type: "code",
				client_id: process.env.SPOTIFY_ID,
				scope: scope,
				redirect_uri: 'http://localhost:3000/api/spotify/callback',
				state: state,
			})
	);
}
