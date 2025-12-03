import { NextApiRequest, NextApiResponse } from 'next';

const Mailjet = require('node-mailjet');
const { verify } = require('hcaptcha');

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, CAPTCHA_SECRET } = process.env;

  if (!MJ_APIKEY_PUBLIC || !MJ_APIKEY_PRIVATE || !CAPTCHA_SECRET) {
    console.error('Missing env vars', {
      hasPublic: Boolean(MJ_APIKEY_PUBLIC),
      hasPrivate: Boolean(MJ_APIKEY_PRIVATE),
      hasCaptcha: Boolean(CAPTCHA_SECRET),
    });
    return res.status(500).json({
      success: false,
      message: 'Email service not configured. Please try again later.',
    });
  }

  // Basic server-side validation to avoid sending bad payloads downstream.
  const { name, email, message, captchaToken } = req.body || {};
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !captchaToken ||
    name.trim().length === 0 ||
    message.trim().length === 0 ||
    message.trim().length > 500
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid form payload.',
    });
  }

  try {
    const captchaValidation = await verify(CAPTCHA_SECRET, captchaToken);

    if (!captchaValidation.success) {
      return res.status(422).json({
        success: false,
        message: 'Unprocessable request, invalid captcha code.',
      });
    }
  } catch (error) {
    console.error('hCaptcha verification failed', error);
    return res.status(422).json({ success: false, message: 'Captcha verification failed.' });
  }

  let mailjet;
  try {
    mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
  } catch (error) {
    console.error('Mailjet init failed', error);
    return res.status(500).json({
      success: false,
      message: 'Email service unavailable right now. Please try again later.',
    });
  }

  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'evan@ebox86.com',
            Name: 'Portfolio Website',
          },
          To: [
            {
              Email: 'evan@ebox86.com',
              Name: 'Evan',
            },
          ],
          Subject: `New contact from ${name.trim()}`,
          TextPart: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
          HTMLPart: `
                    <div style="font-family: Arial, sans-serif; border: 1px solid #e8e8e8; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Message</h2>
                    <p><strong>Name:</strong> ${name.trim()}</p>
                    <p><strong>Email:</strong> ${email.trim()}</p>
                    <hr style="border: none; border-top: 1px solid #e8e8e8;">
                    <p>${message.trim()}</p>
                    </div>
                `,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Thanks for contacting me!',
    });
  } catch (err: any) {
    const statusCode = err?.statusCode || err?.response?.status || 502;
    const reason =
      err?.message ||
      err?.response?.statusText ||
      (typeof err?.response?.text === 'string' ? err.response.text : undefined);

    console.error('Mailjet send failed', {
      statusCode,
      reason,
      data: err?.response?.data,
    });

    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 502).json({
      success: false,
      message: 'Email provider error. Please try again later.',
    });
  }
};

export default sendEmail;
