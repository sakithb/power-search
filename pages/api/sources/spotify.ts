import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../_app";

const accessToken = {
    token: "",
    created: 0,
};

const refreshAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `2d09118801bb430385944b31aa11db62:${process.env.SPOTIFY_SECRET}`
            ).toString("base64")}`,
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    const responseData = await response.json();

    accessToken.token = responseData.access_token;
    accessToken.created = Date.now();
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.q) {
        const query = encodeURIComponent(req.query.q as string);

        console.log(accessToken);
        if (Date.now() - accessToken.created >= 3600000) {
            console.log("Refreshing access token");
            await refreshAccessToken();
        }

        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${query}&type=track%2Cartist`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken.token}`,
                },
            }
        );

        const responseData = await response.json();
        const searchResults: any[] = [];

        if (responseData.artists) {
            searchResults.push(...responseData.artists.items);
        }

        if (responseData.tracks) {
            searchResults.push(...responseData.tracks.items);
        }

        const artistResults: Result[] = [];
        const trackResults: Result[] = [];

        searchResults.forEach((result: any) => {
            const resultData: Result = {
                type: "compact",
                title: result.name,
                url: result.external_urls.spotify,
            };

            const images =
                result.images || (result.album && result.album.images);
            if (images && images.length > 0) {
                resultData.image = images[0].url;
            }

            if (result.type === "artist") {
                resultData.header = `${result.followers.total} followers`;
                resultData.footer = result.genres.join(", ");
                artistResults.push(resultData);
            } else if (result.type === "track") {
                resultData.header = `By ${result.artists
                    .map((a: any) => a.name)
                    .join(", ")}`;

                if (result.album) {
                    resultData.header += ` (${result.album.name})`;
                }

                const totalSeconds = Math.ceil(result.duration_ms / 1000);
                const minutes = Math.ceil(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                resultData.footer = `${minutes}m ${seconds}s`;

                trackResults.push(resultData);
            }
        });

        const processedResults = [];

        if (trackResults.length > 0) {
            processedResults.push({
                title: "Tracks",
                metadata: `No. of results - ${responseData.tracks.total}`,
                results: trackResults,
            });
        }

        if (artistResults.length > 0) {
            processedResults.push({
                title: "Artists",
                metadata: `No. of results - ${responseData.artists.total}`,
                results: artistResults,
            });
        }

        res.json(processedResults);
    } else {
        res.status(400).json({});
    }
};

export default handler;
