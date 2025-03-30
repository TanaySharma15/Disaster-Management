import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("Sending welcome email to:", email);
    if (!email) {
      return NextResponse.json(
        { error: "Email not provided" },
        { status: 400 }
      );
    }

    const htmlContent = `
      <h1>Welcome to DisasterWatch!</h1>
      <p>Thank you for subscribing to our disaster news updates. We’ll keep you informed with the latest news and alerts.</p>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to DisasterWatch!",
      html: htmlContent,
    };

    console.log("Mail options:", mailOptions);

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");

    return NextResponse.json(
      { message: "Welcome email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}
