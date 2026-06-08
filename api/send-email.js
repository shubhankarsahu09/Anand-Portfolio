import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullName, email, phone, service, message } = req.body;
    
    // Retrieve SMTP key from environment variables
    const smtpKey = process.env.BREVO_API_KEY;
    
    if (!smtpKey) {
        return res.status(500).json({ error: "Server configuration error: BREVO_API_KEY environment variable is missing." });
    }

    // Configure Nodemailer transporter with Brevo SMTP details
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'adeb0e001@smtp-brevo.com',
            pass: smtpKey.trim()
        }
    });

    try {
        await transporter.sendMail({
            from: '"Portfolio Contact Form" <adeb0e001@smtp-brevo.com>',
            to: 'andsharan26@gmail.com',
            replyTo: `"${fullName}" <${email}>`,
            subject: `New Inquiry from ${fullName} - ${service}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="background-color: #00302e; color: #9ada00; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px;">New Portfolio Inquiry</h2>
                    </div>
                    <div style="padding: 24px; background-color: #f9f9f9;">
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; width: 120px; border-bottom: 1px solid #eee;">Name:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${fullName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #00302e; text-decoration: underline;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Service:</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${service}</td>
                            </tr>
                        </table>
                        <div style="background-color: #fff; border-left: 4px solid #9ada00; padding: 15px; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                            <h4 style="margin: 0 0 10px 0; color: #00302e;">Message:</h4>
                            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    <div style="background-color: #eee; text-align: center; padding: 12px; font-size: 11px; color: #666;">
                        Sent from Portfolio Contact Page. Reply to this email to contact the visitor directly.
                    </div>
                </div>
            `
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("SMTP Error:", err);
        return res.status(500).json({ error: err.message });
    }
}
