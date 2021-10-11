import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "../../_app";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.q) {
        const query = encodeURIComponent(req.query.q as string);
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.UNSPLASH_API_KEY}`
        );
        const responseData = await response.json();
        const searchResults = responseData.results;

        const totalResults = responseData.total;

        const processedResults = searchResults.map((result: any) => ({
            type: "normal",
            header: `${result.likes} likes`,
            title: `By ${result.user.name}`,
            image: result.urls.full,
            description: result.description,
            footer: new Date(result.created_at).toUTCString(), // Markdown
        }));

        res.json([
            {
                title: "Search results",
                metadata: `No. of Results - ${totalResults}`,
                results: processedResults,
            },
        ]);
    } else {
        res.status(400).json({});
    }
};

export default handler;
