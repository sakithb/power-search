import TurndownService from "turndown";
import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../_app";

const turndownService = new TurndownService();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.q) {
        const query = encodeURIComponent(req.query.q as string);
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&utf8=&format=json`
        );
        const responseData = await response.json();
        const noOfHits = responseData.query.searchinfo.totalhits;
        const searchResults = responseData.query.search;
        const processedResults: Result[] = searchResults.map((result: any) => ({
            type: "normal",
            header: `Word count - ${result.wordcount}`, // Markdown
            title: result.title,
            description: turndownService.turndown(result.snippet),
            footer: new Date(result.timestamp).toUTCString(), // Markdown
        }));
        res.json([
            {
                title: "Search results",
                metadata: `No. of Results - ${noOfHits}`,
                results: processedResults,
            },
        ]);
    } else {
        res.status(400).json({});
    }
};

export default handler;
