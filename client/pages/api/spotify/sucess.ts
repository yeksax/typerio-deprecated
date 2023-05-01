// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from 'cookies-next';


type Data = {
	name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const access_token = req.query.access_token as string
  const refresh_token = req.query.refresh_token as string

  setCookie('spotify_access_token', access_token, { req, res, maxAge: 60 * 60 });
  setCookie('spotify_refresh_token', refresh_token, { req, res });

  res.redirect('http://localhost:3000/user/me')
}
