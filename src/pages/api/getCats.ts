import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const getCats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
        const limit: number = Number(req.query.limit);
        const response = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${process.env.CAT_API_KEY}`);
        return res.status(200).json(response.data);
    }
    return res.status(405).end(); // Method Not Allowed
} catch (error) {
    console.error("Error fetching from TheCatAPI:", error);
    return res.status(500).json({ error: 'Failed to fetch cat data' });
  }
};
export default getCats