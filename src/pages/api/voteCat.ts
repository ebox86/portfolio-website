import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const voteCats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { image_id, value } = req.body;

      if (!image_id || value === undefined) {
        return res.status(400).json({ message: 'image_id and value are required in the request body.' });
      }

      const response = await axios.post(
        `https://api.thecatapi.com/v1/votes?api_key=${process.env.CAT_API_KEY}`,
        {
          image_id,
          value,
        }
      );

      return res.status(response.status).json(response.data);
    }

    // Handle other HTTP methods if necessary
    return res.status(405).end(); // Method Not Allowed
  } catch (error: any) {
    console.error("Error posting vote to TheCatAPI:", error);
    return res.status(500).json(error.response?.data || {});
  }
};

export default voteCats