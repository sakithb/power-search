import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../_app";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.q) {
        const query = encodeURIComponent(req.query.q as string);
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=10&key=${process.env.GOOGLE_KEY}`
        );
        const responseData = await response.json();
        const searchResults = responseData.items;

        const videoResults: Result[] = [];
        const channelResults: Result[] = [];
        const userResults: Result[] = [];

        searchResults.forEach((result: any) => {
            const resultData = {
                type: "compact",
                title: result.snippet.title,
                image: result.snippet.thumbnails.default.url,
                description: result.snippet.description,
                footer: new Date(result.snippet.publishedAt).toUTCString(), // Markdown
            };
            if (result.id.kind === "youtube#video") {
                videoResults.push(resultData);
            } else if (result.id.kind === "youtube#channel") {
                channelResults.push(resultData);
            } else if (result.id.kind === "youtube#user") {
                userResults.push(resultData);
            }
        });

        res.json([
            {
                title: "Videos",
                metadata: `No. of Results - ${videoResults.length}`,
                results: videoResults,
            },
            {
                title: "Channels",
                metadata: `No. of Results - ${channelResults.length}`,
                results: channelResults,
            },
            {
                title: "Users",
                metadata: `No. of Results - ${userResults.length}`,
                results: userResults,
            },
        ]);
    } else {
        res.status(400).json({});
    }
};

export default handler;
