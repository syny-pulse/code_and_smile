
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // false for port 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});


export async function sendNewsletterWelcomeEmail(email: string, name?: string) {
  const greeting = name ? `Hi ${name},` : 'Hi there,';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #267fc3;">Welcome to the Code and Smile Community!</h1>
      </div>
      <p style="color: #333; font-size: 16px;">${greeting}</p>
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Thank you so much for subscribing to our newsletter! We are thrilled to have you with us.
      </p>
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        You can expect monthly updates from us sharing the exciting work we do, the impact we are creating, and stories from our community.
      </p>
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Stay tuned!
      </p>
      <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Code and Smile Foundation<br>
          <a href="${process.env.NEXTAUTH_URL}" style="color: #267fc3; text-decoration: none;">Visit our website</a>
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Code and Smile Newsletter!',
      html,
    });
    console.log(`Newsletter welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending newsletter welcome email:', error);
    // Don't throw, just log so the subscription process isn't interrupted
  }
}

export async function sendContactFormAcknowledgement(email: string, name: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #267fc3;">We received your message!</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hi ${name},</p>
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Thank you for reaching out to us. We have received your message and appreciate you contacting us.
      </p>
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        One of our team members will get back to you within 12 hours.
      </p>
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Best regards,<br>
        The Code and Smile Team
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'We received your message - Code and Smile',
      html,
    });
    console.log(`Contact acknowledgement email sent to ${email}`);
  } catch (error) {
    console.error('Error sending contact acknowledgement email:', error);
  }
}

export async function sendContactFormAdminAlert(data: { name: string; email: string; subject: string; message: string }) {
  const adminEmail = 'sinai@casacademy.org';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; border-left: 5px solid #267fc3;">
      <h2 style="color: #333; margin-top: 0;">New Contact Form Submission</h2>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p style="margin: 10px 0;"><strong>Subject:</strong> ${data.subject}</p>
      </div>
      <div style="margin-top: 20px;">
        <h3 style="color: #555; font-size: 16px;">Message:</h3>
        <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
      <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        This is an automated notification from the Code and Smile website.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: `[Contact Form] ${data.subject}`,
      html,
      replyTo: data.email,
    });
    console.log(`Contact admin alert sent to ${adminEmail}`);
  } catch (error) {
    console.error('Error sending contact admin alert:', error);
  }
}

export async function sendWelcomeEmail(email: string, firstName: string, token: string) {
  const setupUrl = `${process.env.NEXTAUTH_URL}/auth/setup-password?token=${token}`;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #267fc3; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Welcome to Code and Smile!</h1>
      </div>
      
      <p style="color: #1a1a1a; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Hi ${firstName},</p>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        An account has been created for you at Code and Smile. We're excited to have you join our platform!
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px; font-weight: 500;">Please click the button below to set your password and activate your account:</p>
        <a href="${setupUrl}" style="display: inline-block; background-color: #267fc3; color: #ffffff; padding: 14px 32px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 12px; shadow: 0 4px 6px -1px rgba(38, 127, 195, 0.4);">
          Set My Password
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
        This invitation link will expire in 24 hours. If you didn't expect this invitation, you can safely ignore this email.
      </p>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center;">
        <p style="color: #267fc3; font-size: 14px; font-weight: 700; margin-bottom: 4px;">Code and Smile Foundation</p>
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">Empowering growth through learning</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Code and Smile - Account Invitation',
      html,
    });
    console.log(`Welcome invitation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}
