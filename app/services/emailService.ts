export async function sendEmail({ 
  to_name, 
  to_email, 
  file_link 
}: {
  to_name: string;
  to_email: string;
  file_link: string;
}) {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY, // Needed for server-side
        template_params: {
          to_name: to_name,
          to_email: to_email,
          name: to_name,
          email: to_email,
          file_link: file_link,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Email sent:", result);
    return result;
  } catch (err) {
    console.error("❌ EmailJS error:", err);
    throw err;
  }
}