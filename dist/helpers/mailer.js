"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = require("nodemailer");
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("GMAIL_USER or GMAIL_PASS is not set in environment variables.");
    throw new Error("Missing Gmail credentials");
}
exports.transporter = (0, nodemailer_1.createTransport)({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});
