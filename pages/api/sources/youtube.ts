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
        const playlistResults: Result[] = [];

        searchResults.forEach((result: any) => {
            const resultData = {
                type: "compact",
                title: result.snippet.title,
                image: result.snippet.thumbnails.default.url,
                url: "",
                description: result.snippet.description,
                footer: new Date(result.snippet.publishedAt).toUTCString(), // Markdown
            };
            if (result.id.kind === "youtube#video") {
                resultData.url = `http://www.youtube.com/watch?v=${result.id.videoId}`;
                videoResults.push(resultData);
            } else if (result.id.kind === "youtube#channel") {
                resultData.url = `http://www.youtube.com/channel/${result.id.channelId}`;
                channelResults.push(resultData);
            } else if (result.id.kind === "youtube#playlist") {
                resultData.url = `http://www.youtube.com/playlist?list=${result.id.playlistId}`;
                playlistResults.push(resultData);
            }
        });

        const processedResults = [];

        if (videoResults.length > 0) {
            processedResults.push({
                title: "Videos",
                metadata: `No. of videos - ${videoResults.length}`,
                results: videoResults,
            });
        }
        if (channelResults.length > 0) {
            processedResults.push({
                title: "Channels",
                metadata: `No. of channels - ${channelResults.length}`,
                results: channelResults,
            });
        }
        if (playlistResults.length > 0) {
            processedResults.push({
                title: "Playlists",
                metadata: `No. of playlists ${playlistResults.length}`,
                results: playlistResults,
            });
        }

        res.json(processedResults);
    } else {
        res.status(400).json({});
    }
};

export default handler;
