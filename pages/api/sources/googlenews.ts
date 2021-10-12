import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../_app";
import TurndownService from "turndown";
import RSSParser from "rss-parser";

const turndownService = new TurndownService();

const rssParser = new RSSParser({ customFields: { item: ["source"] } });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.q) {
        const query = encodeURIComponent(req.query.q as string);
        const responseData = await rssParser.parseURL(`https://news.google.com/rss/search?q=${query}`);
        const searchResults = responseData.items;
        const processedResults: Result[] = searchResults.map((result: any) => ({
            type: "normal",
            header: `From ${result.source}`,
            title: result.title,
            url: result.link,
            description: turndownService.turndown(result.content),
            footer: result.pubDate, // Markdown
        }));
        res.json([
            {
                title: "Search results",
                metadata: `No. of Results - ${searchResults.length}`,
                results: processedResults,
            },
        ]);
    } else {
        res.status(400).json({});
    }
};

export default handler;
