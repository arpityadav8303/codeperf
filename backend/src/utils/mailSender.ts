import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

interface BrevoResponse {
    messageId: string;
}

export const sendMail = async (to: string, subject: string, htmlBody: string): Promise<{ success: boolean; messageId: string }> => {
    const apiKey = process.env.EMAIL_PASSWORD;
    const senderEmail = process.env.EMAIL_SENDER;

    if (!apiKey) {
        throw new Error('EMAIL_PASSWORD (Brevo API Key) not found in .env');
    }
    if (!senderEmail) {
        throw new Error('EMAIL_SENDER not found in .env');
    }

    const payload = {
        sender: {
            name: process.env.BUSINESS_NAME || 'InvoiceHub',
            email: senderEmail
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlBody,
    };

    try {
        const response = await axios.post<BrevoResponse>(
            'https://api.brevo.com/v3/smtp/email',
            payload,
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        return { success: true, messageId: response.data.messageId };
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message;
        const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR';
        
        console.error(`Brevo Email Service Error [${errorCode}]:`, errorMsg);
        throw new Error(`Failed to send email: ${errorMsg}`);
    }
};