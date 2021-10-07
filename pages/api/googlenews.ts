import { NextApiRequest, NextApiResponse } from "next";

import GoogleNews from "google-news-rss";

const googleNews = new GoogleNews();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    (async () => {
        try {
            const results = await googleNews.search(req.query.q);
            res.json(results);
        } catch(error) {
            res.status(500);
            res.json({
                type: "error"
            });
        }
    })()
}

export default handler;