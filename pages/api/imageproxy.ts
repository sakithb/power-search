import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
	const result = await fetch(decodeURIComponent(req.query.url as string));
	(result.body as any).pipe(res);
};

export default handler;
