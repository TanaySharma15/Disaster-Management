import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { emails } = await request.json();
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "No emails provided" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const newsRes = await axios.get(`${baseUrl}/api/news?lang=en`);
    const newsList = newsRes.data.news;

    let htmlContent = `<h1>Latest Disaster News</h1><ul>`;
    newsList.forEach((article: any) => {
      htmlContent += `<li>
        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
          ${article.title}
        </a><br/>
        ${article.description}
      </li>`;
    });
    htmlContent += `</ul>`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(", "),
      subject: "Latest Disaster News",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
