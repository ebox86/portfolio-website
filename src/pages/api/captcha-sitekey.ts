import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const siteKey = (process.env.NEXT_PUBLIC_CAPTCHA_KEY || '').trim();
  const envPresent = siteKey.length > 0;

  if (!envPresent) {
    // Return 200 with a disabled flag so the client can gracefully disable the form without logging a network error.
    return res.status(200).json({ siteKey: null, disabled: true, envPresent: false });
  }

  return res.status(200).json({ siteKey, disabled: false, envPresent: true });
}
