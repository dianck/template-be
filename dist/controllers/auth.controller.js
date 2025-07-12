"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import prisma from "../../prisma";
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const handlebars_1 = __importDefault(require("handlebars"));
const mailer_1 = require("../helpers/mailer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../prisma"));
const isDebug = process.env.DEBUG === "false";
function logDebug(message, ...optionalParams) {
    if (isDebug) {
        console.log("[DEBUG]", message, ...optionalParams);
    }
}
class AuthController {
    async register(req, res) {
        try {
            logDebug("BODY", req.body);
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                res.status(400).send({ message: "All fields are required" });
                return;
            }
            logDebug("FIELD CHECK OK...");
            const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(409).send({ message: "Email already registered" });
                return;
            }
            logDebug("DATA EXIST CHECK OK...");
            logDebug("Registering user...");
            const salt = await (0, bcrypt_1.genSalt)(10);
            const hashedPassword = await (0, bcrypt_1.hash)(password, salt);
            const user = await prisma_1.default.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },
            });
            logDebug("REGISTER CHECK OK...");
            //token untuk registrasi
            const payload = { id: user.id };
            const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY_VERIFY, { expiresIn: "10m" });
            logDebug("TOKEN Generated OK...");
            const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
            await prisma_1.default.email_verifications.create({
                data: { userId: user.id, token, expiredAt },
            });
            logDebug("Email VErification insertion OK...");
            const templatePath = path_1.default.join(__dirname, "../templates", "verify.hbs");
            if (!fs_1.default.existsSync(templatePath)) {
                res.status(500).send({ message: "Email template not found" });
                return;
            }
            logDebug("Email TEMPLATE PATH OK...");
            const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
            const compiledTemplate = handlebars_1.default.compile(templateSource);
            const html = compiledTemplate({
                username: user.username,
                link: `${process.env.EMAIL_VERIFICATION_URL}/verify?token=${token}`
            });
            logDebug("Email Html Template OK...");
            await mailer_1.transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: user.email,
                subject: "Verify Email",
                html,
            });
            logDebug("Email Verification SENT OK...");
            res.status(201).send({ message: "Register OK" });
        }
        catch (err) {
            console.error("Register error:", err);
            res.status(500).send({ message: "Internal server error", error: err });
        }
    }
    async verify(req, res) {
        console.log("TOKEN VERIFICATION");
        try {
            const { id } = res.locals?.user;
            const token = res.locals?.token;
            const data = await prisma_1.default.email_verifications.findFirst({
                where: { token, userId: id },
            });
            if (!data)
                throw { message: "Invalid link verification " };
            await prisma_1.default.user.update({
                data: { isVerified: true },
                where: { id },
            });
            await prisma_1.default.email_verifications.delete({
                where: { id: data.id }
            });
            res.status(200).send({ message: "Verification Successfully" });
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
    async login(req, res) {
        try {
            const { login, password } = req.body;
            const user = await prisma_1.default.user.findFirst({
                where: {
                    OR: [
                        { username: login },
                        { email: login }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password: true,
                    avatar: true,
                    isVerified: true,
                    // Jangan ambil points langsung (array), akan kita jumlahkan terpisah
                }
            });
            if (!user) {
                res.status(404).send({ message: "User not found" });
                return;
            }
            const isPasswordValid = await (0, bcrypt_1.compare)(password, user.password);
            if (!isPasswordValid) {
                res.status(401).send({ message: "Invalid password" });
                return;
            }
            if (!user.isVerified) {
                res.status(402).send({ message: "Account not verified, please check your email verification!" });
                return;
            }
            const payload = { id: user.id };
            const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
            const { password: _, ...userWithoutPassword } = user;
            res.status(200).send({
                message: "Login OK",
                user: {
                    ...userWithoutPassword,
                },
                token
            });
        }
        catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }
    async emailConfirmPasswordReset(req, res) {
        try {
            const { email } = req.body;
            console.log("req.body: ", req.body);
            const user = await prisma_1.default.user.findFirst({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password: true,
                    avatar: true,
                    isVerified: true,
                    // Jangan ambil points langsung (array), akan kita jumlahkan terpisah
                }
            });
            if (!user) {
                res.status(404).send({ message: "Email has not been registerred" });
                return;
            }
            if (!user.isVerified) {
                res.status(402).send({ message: "Account not verified, please check your email verification!" });
                return;
            }
            //token untuk verifikasi
            const payload = { id: user.id };
            const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY_VERIFY, { expiresIn: "10m" });
            logDebug("TOKEN Generated OK...");
            const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
            await prisma_1.default.email_verifications.create({
                data: { userId: user.id, token, expiredAt },
            });
            logDebug("Email VErification insertion OK...");
            const templatePath = path_1.default.join(__dirname, "../templates", "reset.hbs");
            if (!fs_1.default.existsSync(templatePath)) {
                res.status(500).send({ message: "Email template not found" });
                return;
            }
            logDebug("Email TEMPLATE PATH OK...");
            const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
            const compiledTemplate = handlebars_1.default.compile(templateSource);
            const html = compiledTemplate({
                username: user.username,
                brand: process.env.BRAND,
                link: `${process.env.EMAIL_VERIFICATION_URL}/reset-pwd?token=${token}`
            });
            logDebug("Email Html Template OK...");
            await mailer_1.transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: user.email,
                subject: "Reset Password",
                html,
            });
            logDebug("Email Reset Password SENT OK...");
            res.status(201).send({ message: "Check your email" });
        }
        catch (err) {
            console.error("Psssword Reset request error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }
    async verifyResetPassword(req, res) {
        console.log("TOKEN VERIFICATION");
        try {
            const { id } = res.locals?.user;
            const token = res.locals?.token;
            const data = await prisma_1.default.email_verifications.findFirst({
                where: { token, userId: id },
            });
            if (!data) {
                res.status(404).send({ message: "Invalid link verification" });
                return;
            }
            if (!data)
                throw { message: "Invalid link verification " };
            await prisma_1.default.email_verifications.delete({
                where: { id: data.id }
            });
            const user = await prisma_1.default.user.findFirst({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    email: true,
                    // Jangan ambil points langsung (array), akan kita jumlahkan terpisah
                }
            });
            res.status(200).send({
                message: "Link verified, let continue to reset your password",
                user: user
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
    async resetPassword(req, res) {
        try {
            logDebug("BODY", req.body);
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).send({ message: "All fields are required" });
                return;
            }
            logDebug("FIELD CHECK OK...");
            const user = await prisma_1.default.user.findFirst({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password: true,
                    avatar: true,
                    isVerified: true,
                    // Jangan ambil points langsung (array), akan kita jumlahkan terpisah
                }
            });
            // 🔐 Hash the new password
            const salt = await (0, bcrypt_1.genSalt)(10);
            const hashedPassword = await (0, bcrypt_1.hash)(password, salt);
            // 📝 Update password in database
            await prisma_1.default.user.update({
                where: { email: email },
                data: {
                    password: hashedPassword,
                },
            });
            res.status(201).send({ message: "Password reset success..." });
        }
        catch (err) {
            console.error("Register error:", err);
            res.status(500).send({ message: "Internal server error", error: err });
        }
    }
}
exports.default = AuthController;
/*

curl -X GET http://localhost:8000/api

curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "budi",
    "email": "hapegyjo@forexnews.bg",
    "password": "asd123"
  }'


curl -X PATCH http://localhost:8000/api/auth/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImlhdCI6MTc1MTQ0MTgwOCwiZXhwIjoxNzUxNDQyNDA4fQ.dWvOCUTZtrdtbY910Gw6817oBTw6TuqL17CiVIBBM7c"
  
*/ 
