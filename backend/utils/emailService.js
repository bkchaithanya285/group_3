const SibApiV3Sdk = require('sib-api-v3-sdk');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendPendingEmail = async (hunter) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "CyberNova Registration - Pending Approval";
    sendSmtpEmail.sender = { name: "CyberNova Admin", email: "cybernovabyowasp@gmail.com" };
    sendSmtpEmail.to = [{ email: hunter.academyMail, name: hunter.hunterName }];
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { background-color: #000; color: #fff; font-family: 'Courier New', monospace; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; border: 1px solid #7627dc; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(118, 39, 220, 0.3); }
                .header { background: linear-gradient(90deg, #3b0764, #1e1b4b); padding: 20px; text-align: center; border-bottom: 2px solid #fbbf24; }
                .header h1 { margin: 0; color: #fbbf24; text-shadow: 0 0 10px #fbbf24; letter-spacing: 2px; }
                .content { padding: 30px; background-color: #0a0a0a; }
                .status-box { background-color: #333; padding: 15px; border-left: 4px solid #fbbf24; color: #fbbf24; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; color: #666; padding: 10px; font-size: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>REGISTRATION RECEIVED</h1>
                </div>
                <div class="content">
                    <p style="font-size: 16px; color: #fff;">Greetings Hunter <strong>${hunter.hunterName}</strong>,</p>
                    <p>You have successfully registered in the CyberNova System.</p>
                    
                    <div class="status-box">
                        STATUS: APPROVAL PENDING
                    </div>

                    <p>Your application is currently under review by the Guild Masters.</p>

                    <p>While you wait for verification, it is <strong>COMPULSORY</strong> to join the WhatsApp Guild:</p>
                    
                    <a href="https://chat.whatsapp.com/K32X11n8XrgIrdcSCKq3Cs?mode=gi_t" class="cta-btn">
                        JOIN WHATSAPP GUILD
                    </a>

                    <p style="margin-top: 20px;">Please stand by.</p>
                </div>
                <div class="footer">
                    SYSTEM GENERATED MESSAGE // DO NOT REPLY<br>
                    CYBERNOVA SERIES 2026
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Pending email sent to ' + hunter.academyMail);
    } catch (error) {
        console.error('Error sending pending email:', error);
    }
};

const sendApprovalEmail = async (hunter) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "ACCESS GRANTED - CyberNova Gate Open";
    sendSmtpEmail.sender = { name: "CyberNova Admin", email: "cybernovabyowasp@gmail.com" };
    sendSmtpEmail.to = [{ email: hunter.academyMail, name: hunter.hunterName }];
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { background-color: #000; color: #fff; font-family: 'Courier New', monospace; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; border: 1px solid #7627dc; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(118, 39, 220, 0.3); }
                .header { background: linear-gradient(90deg, #3b0764, #1e1b4b); padding: 20px; text-align: center; border-bottom: 2px solid #22d3ee; }
                .header h1 { margin: 0; color: #22d3ee; text-shadow: 0 0 10px #22d3ee; letter-spacing: 2px; }
                .content { padding: 30px; background-color: #0a0a0a; }
                .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .info-table td { padding: 12px; border-bottom: 1px solid #333; color: #ccc; }
                .info-table td.label { color: #a855f7; font-weight: bold; width: 40%; text-transform: uppercase; }
                .cta-btn { display: block; width: 100%; text-align: center; background-color: #22c55e; color: #fff; padding: 15px; margin-top: 20px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                .footer { text-align: center; color: #666; padding: 10px; font-size: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>ACCESS GRANTED</h1>
                </div>
                <div class="content">
                    <p style="font-size: 16px; color: #fff;">Greetings Hunter <strong>${hunter.hunterName}</strong>,</p>
                    <p>Your profile has been <strong>VERIFIED</strong>. You are now authorized to enter.</p>
                    
                    <table class="info-table">
                        <tr><td class="label">Hunter ID</td><td>${hunter.hunterId}</td></tr>
                        <tr><td class="label">Guild</td><td>${hunter.department}</td></tr>
                        <tr><td class="label">Rank</td><td>${hunter.rankLevel}</td></tr>
                        <tr><td class="label">Squad</td><td>${hunter.squad}</td></tr>
                    </table>

                    <p style="text-align: center; color: #22d3ee; margin-top: 30px;">REQUIRED PROTOCOL:</p>
                    <a href="https://chat.whatsapp.com/K32X11n8XrgIrdcSCKq3Cs?mode=gi_t" class="cta-btn">
                        JOIN WHATSAPP GUILD
                    </a>
                </div>
                <div class="footer">
                    SYSTEM GENERATED MESSAGE // DO NOT REPLY<br>
                    CYBERNOVA SERIES 2026
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Approval email sent to ' + hunter.academyMail);
    } catch (error) {
        console.error('Error sending approval email:', error);
    }
};

const sendMilestoneEmail = async (count, latestHunter) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = `🚨 MILESTONE ALERT: ${count} Hunters Registered!`;
    sendSmtpEmail.sender = { name: "CyberNova System", email: "cybernovabyowasp@gmail.com" };
    sendSmtpEmail.to = [{ email: "cybernovabyowasp@gmail.com", name: "Admin" }]; // Send to self/admin
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #000; color: #fff; font-family: sans-serif; padding: 20px;">
            <div style="border: 1px solid #fbbf24; padding: 20px; text-align: center;">
                <h1 style="color: #fbbf24;">🎉 MILESTONE REACHED!</h1>
                <p style="font-size: 24px;">Total Registrations: <strong>${count}</strong></p>
                <hr style="border-color: #333;">
                <p><strong>Latest Hunter:</strong> ${latestHunter.hunterName} (${latestHunter.hunterId})</p>
                <p><strong>Department:</strong> ${latestHunter.department}</p>
                <br>
                <p style="color: #888; font-size: 12px;">CyberNova Automated System</p>
            </div>
        </body>
        </html>
    `;

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Milestone email (${count}) sent to Admin.`);
    } catch (error) {
        console.error('Error sending milestone email:', error);
    }
};

module.exports = { sendPendingEmail, sendApprovalEmail, sendMilestoneEmail };
