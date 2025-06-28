import { createTransport } from "nodemailer";

export const transporter =  createTransport({
    service: "gmail",
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})