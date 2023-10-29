import { NextApiRequest, NextApiResponse } from 'next';

const Mailjet = require('node-mailjet');
const {verify} = require('hcaptcha');

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    // Verify hCaptcha token first
    try {
        const captchaValidation = await verify(process.env.CAPTCHA_SECRET, req.body.captchaToken)

        if (!captchaValidation.success) {
            return res.status(422).json({
                message: "Unprocessable request, Invalid captcha code",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(422).json({ message: "Something went wrong with hCAPTCHA validation" });
    }

    // If reCAPTCHA is valid, proceed to send email using Mailjet
    const emailRequest = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            Messages: [
                {
                From: {
                    Email: "evan@ebox86.com", 
                    Name: "Portfolio Website"
                },
                To: [
                    {
                    Email: "evan@ebox86.com",
                    Name: "Evan"
                    }
                ],
                Subject: `New contact from ${req.body.name}`,
                TextPart: `Name: ${req.body.name}\nEmail: ${req.body.email}\n\nMessage:\n${req.body.message}`,
                HTMLPart: `
                    <div style="font-family: Arial, sans-serif; border: 1px solid #e8e8e8; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Message</h2>
                    <p><strong>Name:</strong> ${req.body.name}</p>
                    <p><strong>Email:</strong> ${req.body.email}</p>
                    <hr style="border: none; border-top: 1px solid #e8e8e8;">
                    <p>${req.body.message}</p>
                    </div>
                `
                }
            ]
        });

    emailRequest
    .then((result: any) => {
        res.send({
            success: true,
            message: 'Thanks for contacting me!',
        });
    })
    .catch((err: any) => {
        res.status(500).send({
            success: false,
            message: 'Something went wrong. Try again later',
        });
    });
};