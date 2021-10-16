import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../_app";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.q) {
        const query = encodeURIComponent(req.query.q as string);
        const response = await fetch(`http://www.reddit.com/search.json?q=${query}&sort=relevance&limit=10`);
        const responseData = await response.json();
        const searchResults = responseData.data.children;

        const processedResults: Result[] = [];

        searchResults.forEach(({ data: result }: any) => {
            const resultData: Result = {
                type: "compact",
                header: `Posted on [_r/${result.subreddit}_](https://reddit.com/r/${result.subreddit}) by [_u/${result.author}_](https://reddit.com/u/${result.author})`,
                title: result.title,
                description: result.selftext,
                url: `https://reddit.com/${result.permalink}`,
                footer: new Date(parseInt(result.created_utc)).toUTCString(), // Markdown
            };

            if (result.preview && result.preview.images && result.preview.images.length > 0) {
                resultData.image = result.preview.images[0].source.url.replace(/&amp;/g, "&");
            }

            if (result.media_only) {
                resultData.type = "normal";
            }

            processedResults.push(resultData);
        });

        res.json([
            {
                title: "Search results",
                metadata: "",
                results: processedResults,
            },
        ]);
    } else {
        res.status(400).json({});
    }
};

export default handler;
