import type { ActionFunctionArgs } from "react-router";
import { createTransport } from "nodemailer";

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Expect JSON body: { name, file_link, to_email }
    const { name = "Customer (Muki)", file_link = "#", to_email } = await request.json();

    if (!to_email) {
      return Response.json({ error: "to_email is required" }, { status: 400 });
    }

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "khain.app@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const html = `
<!-- Main Container -->
<table style="background-color: #f5f5f5;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="padding: 40px 20px;"><!-- Email Card -->
<table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0"><!-- Header with Logo -->
<tbody>
<tr>

</tr>
<!-- Content Section -->
<tr>
<td style="padding: 40px 40px 32px 40px;"><!-- Greeting -->
<h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #1a1a1a; line-height: 1.3; font-family: 'Prompt', sans-serif;"><!-- English --> <span class="en">Hi ${name},</span> <!-- Thai --> <span class="th">สวัสดี ${name},</span></h1>
<!-- Message Body -->
<p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4a4a4a; font-family: 'Prompt', sans-serif;"><!-- English --> <span class="en"> Thank you for your support! Your file is ready for download. Click the button below to access your file. </span> <!-- Thai --> <span class="th"> ขอบคุณสำหรับการสนับสนุน! ไฟล์ของคุณพร้อมสำหรับดาวน์โหลดแล้ว คลิกปุ่มด้านล่างเพื่อเข้าถึงไฟล์ของคุณ </span></p>
<!-- CTA Button -->
<table role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="text-align: center; padding-bottom: 32px;"><a style="display: inline-block; padding: 16px 40px; background-color: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 59px; font-size: 16px; font-weight: 600; transition: background-color 0.2s; font-family: 'Prompt', sans-serif;" href="${file_link}" target="_blank" rel="noopener"> <!-- English --> <span class="en">Download File</span> <!-- Thai --> <span class="th">ดาวน์โหลดไฟล์</span> </a></td>
</tr>
</tbody>
</table>
<!-- Alternative Link -->
<p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280; text-align: center; font-family: 'Prompt', sans-serif;"><!-- English --> <span class="en"> Or copy and paste this link into your browser:<br><a style="color: #2563eb; text-decoration: none; word-break: break-all;" href="${file_link}" target="_blank" rel="noopener">${file_link}</a> </span> <!-- Thai --> <span class="th"> หรือคัดลอกและวางลิงค์นี้ในเบราว์เซอร์ของคุณ:<br><a style="color: #2563eb; text-decoration: none; word-break: break-all;" href="${file_link}" target="_blank" rel="noopener">${file_link}</a> </span></p>
</td>
</tr>
<!-- Footer -->
<tr>
<td style="padding: 32px 40px 40px 40px; border-top: 1px solid #f0f0f0;">
<p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.5; color: #1a1a1a; font-family: 'Prompt', sans-serif;"><!-- English --> <span class="en">Best regards,</span> <!-- Thai --> <span class="th">ด้วยความนับถือ,</span></p>
<p style="margin: 0; font-size: 15px; font-weight: 600; color: #1a1a1a; font-family: 'Prompt', sans-serif;">Khain.app</p>
</td>
</tr>
</tbody>
</table>
<!-- Footer Text -->
<table style="max-width: 600px; margin: 24px auto 0 auto;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="text-align: center; padding: 0 20px;">
<p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af; font-family: 'Prompt', sans-serif;"><!-- English --> <span class="en"> This email was sent by Khain.app. If you have any questions, please contact our support team. </span> <!-- Thai --> <span class="th"> อีเมลนี้ถูกส่งโดย Khain.app หากคุณมีคำถามใดๆ โปรดติดต่อทีมสนับสนุนของเรา</span></p>
<p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af; font-family: 'Prompt', sans-serif;"><a href="https://discord.gg/KuMVmcK3cC" target="_blank" rel="noopener"><span class="th">https://discord.gg/KuMVmcK3cC</span></a></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
`;

    const info = await transporter.sendMail({
      from: `"Khain.app" <khain.app@gmail.com>`,
      to: to_email,
      subject: "Shop Khain.app - Thank you for your support!",
      html,
    });

    console.log("Message sent:", info.messageId);

    return Response.json(
      { msg: "Successfully sent", messageId: info.messageId },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Send mail error:", err);
    return Response.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
