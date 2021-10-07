import { NextApiRequest, NextApiResponse } from "next";
import { createApi } from "unsplash-js";

const unsplash = createApi({
    accessKey: "n98E0ji0O4V2ebRlqy6mg2DCvR1ffz-w37UpJSM2Ua0",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    (async () => {
        try {
            const results = await unsplash.search.getPhotos({
                query: req.query.q as string,
                page: 1,
                perPage: 10,
            });
        
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