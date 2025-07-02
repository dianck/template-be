import { createTransport } from "nodemailer";


if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  console.error("GMAIL_USER or GMAIL_PASS is not set in environment variables.");
  throw new Error("Missing Gmail credentials");
}

export const transporter =  createTransport({
    service: "gmail",
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})