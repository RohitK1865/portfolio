import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const emailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message too short"),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request JSON body
    const body = await request.json();
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Log env vars for debugging
    console.log("Email env:", {
      user: process.env.EMAIL_USER,
      passSet: !!process.env.EMAIL_PASSWORD,
      server: process.env.EMAIL_SERVER,
      port: process.env.EMAIL_PORT,
    });

    // Check env variables are set
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD ||
      !process.env.EMAIL_SERVER ||
      !process.env.EMAIL_PORT
    ) {
      return NextResponse.json(
        { success: false, error: "Email environment variables are not set." },
        { status: 500 }
      );
    }

    // Create nodemailer transporter with explicit config
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports like 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    // Verify SMTP connection configuration
    await transporter.verify();
    console.log("SMTP server is ready");

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // you can change this if you want to receive on a different address
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `
New message from your portfolio:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); color: #222;">
  <img 
  src="https://res.cloudinary.com/dfnmvchin/image/upload/v1747655895/Don_t_watch_the_clock_do_what_it_does._Keep_going_b7qsbs.png" 
  alt="Motivational Quote" 
  style="max-width: 100%; height: auto; border-radius: 10px;"
/>

  <header style="text-align: center; margin-bottom: 25px;">
   <h2 style="color: #ff6f61; font-weight: 700; font-size: 24px; margin: 0;">
  🚀 You've Got Mail from Your Portfolio!
</h2>
  </header>

  <section style="background: #f5f8fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
    <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${name}</p>
    <p style="margin: 8px 0;"><strong>📫 Email:</strong> <a href="mailto:${email}" style="color: #4a90e2; text-decoration: none;">${email}</a></p>
    <p style="margin: 8px 0;"><strong>📋 Subject:</strong> ${subject}</p>
  </section>

  <section style="background: #fff; padding: 20px; border-left: 6px solid #4a90e2; border-radius: 0 8px 8px 0;">
    <h3 style="color: #4a90e2; margin-top: 0; margin-bottom: 15px;">💬 Message:</h3>
    <p style="white-space: pre-line; font-size: 16px; line-height: 1.5; color: #333;">
      ${message}
    </p>
  </section>

  <footer style="text-align: center; margin-top: 35px; font-size: 12px; color: #999;">
    <p>Sent from your portfolio contact form</p>
  </footer>

</div>

      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    // Success response
    return NextResponse.json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("Detailed error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email. Please try again later.",
        details:
          process.env.NODE_ENV === "development" &&
          error &&
          typeof error === "object" &&
          "message" in error
            ? (error as { message?: string }).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
