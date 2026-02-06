const SibApiV3Sdk = require('sib-api-v3-sdk');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : '';

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
                    
                    <a href="https://chat.whatsapp.com/K32X11n8XrgIrdcSCKq3Cs?mode=gi_t" 
                       style="display: block; width: 100%; max-width: 300px; margin: 30px auto; text-align: center; background-color: #25D366; color: #fff; padding: 15px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
                        📱 JOIN WHATSAPP GUILD
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

    sendSmtpEmail.subject = `🚀 [MILESTONE] ${count} Hunters Deployed | CyberNova`;
    sendSmtpEmail.sender = { name: "CyberNova Automated System", email: "cybernovabyowasp@gmail.com" };

    // Send to both admins
    sendSmtpEmail.to = [
        { email: "dineshnaidu2065@gmail.com", name: "Dinesh Naidu" },
        { email: "bkrishnachaithanya285@gmail.com", name: "Krishna Chaithanya" }
    ];

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { background-color: #050505; color: #e2e8f0; font-family: 'Courier New', monospace; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #0f0f10; border: 1px solid #7627dc; border-radius: 8px; overflow: hidden; box-shadow: 0 0 25px rgba(118, 39, 220, 0.2); }
                .header { background: linear-gradient(135deg, #2e1065 0%, #000000 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #fbbf24; }
                .badge { display: inline-block; background-color: #fbbf24; color: #000; padding: 5px 15px; border-radius: 50px; font-weight: bold; font-size: 12px; margin-bottom: 10px; }
                .title { font-size: 32px; color: #ffffff; margin: 10px 0; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3); text-transform: uppercase; letter-spacing: 1px; }
                .stat-box { background-color: #1a1a1c; border-left: 4px solid #7627dc; padding: 20px; margin: 20px; }
                .stat-value { font-size: 48px; font-weight: bold; color: #7627dc; display: block; line-height: 1; }
                .stat-label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
                .hunter-info { margin: 20px; padding: 15px; border: 1px dashed #333; border-radius: 4px; background-color: #0a0a0a; }
                .hunter-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                .label { color: #64748b; }
                .value { color: #e2e8f0; font-weight: bold; }
                .footer { text-align: center; padding: 20px; color: #475569; font-size: 11px; border-top: 1px solid #1e293b; background-color: #050505; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="badge">SYSTEM ALERT</span>
                    <h1 class="title">Milestone Unlocked</h1>
                </div>
                
                <div class="stat-box">
                    <span class="stat-value">${count}</span>
                    <span class="stat-label">Total Authenticated Hunters</span>
                </div>

                <div class="hunter-info">
                    <p style="margin: 0 0 10px 0; color: #fbbf24; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">// Latest Access Log</p>
                    <div class="hunter-row">
                        <span class="label">Operative:</span>
                        <span class="value">${latestHunter.hunterName}</span>
                    </div>
                    <div class="hunter-row">
                        <span class="label">ID Tag:</span>
                        <span class="value">${latestHunter.hunterId}</span>
                    </div>
                    <div class="hunter-row">
                        <span class="label">Affiliation:</span>
                        <span class="value">${latestHunter.department}</span>
                    </div>
                    <div class="hunter-row">
                        <span class="label">Timestamp:</span>
                        <span class="value">${timestamp}</span>
                    </div>
                </div>

                <div class="footer">
                    SECURE TRANSMISSION // CYBERNOVA SERIES 2026<br>
                    OWASP x CYBERNERDS x CSI
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Milestone email (${count}) sent to Admins.`);
    } catch (error) {
        console.error('Error sending milestone email:', error);
    }
};

const sendRejectionEmail = async (hunter) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Update on your CyberNova Registration";
    sendSmtpEmail.sender = { name: "CyberNova Admin", email: "cybernovabyowasp@gmail.com" };
    sendSmtpEmail.to = [{ email: hunter.academyMail, name: hunter.hunterName }];
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { background-color: #000; color: #fff; font-family: 'Courier New', monospace; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; border: 1px solid #ef4444; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
                .header { background: linear-gradient(90deg, #450a0a, #000); padding: 20px; text-align: center; border-bottom: 2px solid #ef4444; }
                .header h1 { margin: 0; color: #ef4444; text-shadow: 0 0 10px #ef4444; letter-spacing: 2px; }
                .content { padding: 30px; background-color: #0a0a0a; }
                .message-box { border-left: 4px solid #ef4444; padding: 15px; background-color: #1a1a1a; margin: 20px 0; color: #d1d5db; }
                .footer { text-align: center; color: #666; padding: 15px; font-size: 12px; border-top: 1px solid #333; }
                .love-note { color: #f472b6; font-weight: bold; margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>ACCESS DENIED</h1>
                </div>
                <div class="content">
                    <p style="font-size: 16px; color: #fff;">Greetings Hunter <strong>${hunter.hunterName}</strong>,</p>
                    
                    <div class="message-box">
                        <p style="margin: 0;">We regret to inform you that your registration for the CyberNova Series 2026 has not been accepted at this time.</p>
                    </div>

                    <p>Sorry for the inconvenience. We encourage you to try next time.</p>
                    
                    <p style="font-size: 18px; font-weight: bold; color: #fbbf24; text-align: center; margin-top: 30px;">
                        BETTER LUCK NEXT TIME! 🍀
                    </p>
                </div>
                <div class="footer">
                    SYSTEM GENERATED MESSAGE // DO NOT REPLY<br>
                    <div class="love-note">❤️ With love from OWASP and CYBERNERDS 🤓</div>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Rejection email sent to ' + hunter.academyMail);
    } catch (error) {
        console.error('Error sending rejection email:', error);
    }
};

module.exports = { sendPendingEmail, sendApprovalEmail, sendMilestoneEmail, sendRejectionEmail };
