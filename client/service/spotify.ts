import axios from "axios";

export async function getCurrentlyPlaying(authorization: string) {
	let data = (
		await axios.get(
			"https://api.spotify.com/v1/me/player/currently-playing",
			{
				headers: {
					Authorization: "Bearer " + authorization,
				},
			}
		)
	).data;

	return data;
}
