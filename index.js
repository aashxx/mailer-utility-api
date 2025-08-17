import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

app.post('/send-mail', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});