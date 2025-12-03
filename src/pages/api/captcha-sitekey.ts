import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY;

  if (!siteKey) {
    return res.status(503).json({ message: 'Captcha not configured' });
  }

  return res.status(200).json({ siteKey });
}
