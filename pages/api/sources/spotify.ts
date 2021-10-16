import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../_app";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.q) {
        const query = encodeURIComponent(req.query.q as string);
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track%2Cartist`, {
            headers: {
                Authorization: `Bearer ${process.env.SPOTIFY_KEY}`,
            },
        });
        const responseData = await response.json();
        const searchResults = responseData.items;

        const artistResults: Result[] = [];
        const trackResults: Result[] = [];
        const albumResults: Result[] = [];

        searchResults.forEach((result: any) => {
            const resultData = {
                type: "compact",
                header: `Word count - ${result.wordcount}`, // Markdown
                title: result.title,
                description: result.snippet,
                url: `https://en.wikipedia.org/wiki/${result.title.replace(/ /g, "_")}`,
                footer: new Date(result.timestamp).toUTCString(), // Markdown
            };

            if (result.type === "artist") {
            } else if (result.type === "track") {
            } else if (result.type === "album") {
            }
        });

        const processedResults = [];

        res.json(processedResults);
    } else {
        res.status(400).json({});
    }
};

export default handler;
