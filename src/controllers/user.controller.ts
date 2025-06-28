import { Request, Response } from "express";
import prisma from "../../prisma";
import { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import Handlebars from "handlebars";
import { transporter } from "../helpers/mailer";
import fs from "fs";
import path from "path";

export class UserController{
    async register(req: Request, res: Response) {
        try {
          console.log(req.body);
          const { username, email, password} = req.body;
  
          if (!username || !email || !password ) {
            res.status(400).send({ message: "All fields are required" });
            return; 
          }
          console.log("FIELD CHECK OK...")

          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (existingUser) {
            res.status(409).send({ message: "Email already registered" });
            return;
          }
          console.log("DATA EXIST CHECK OK...")
      
          console.log("Registering user...")
          const salt = await genSalt(10);
          const hashedPassword = await hash(password, salt);
  
  
          const user = await prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
            },
          });

          console.log("REGISTER CHECK OK...")
  
  
          //token untuk registrasi
          const payload = { id: user.id };
          const token = sign(payload, process.env.SECRET_KEY_VERIFY!, { expiresIn: "10m" });

          console.log("TOKEN Generated OK...")
      
          const expiredAt = new Date (Date.now() + 10 * 60 * 1000)
          await prisma.email_verifications.create({
              data: {userId: user.id, token, expiredAt},
          });
  
          console.log("Email VErification insertion OK...")

          const templatePath = path.join(__dirname, "../templates", "verify.hbs");
          if (!fs.existsSync(templatePath)) {
            res.status(500).send({ message: "Email template not found" });
            return;
          }
      
          console.log("Email TEMPLATE PATH OK...")
          

          const templateSource = fs.readFileSync(templatePath, "utf-8");
          const compiledTemplate = Handlebars.compile(templateSource);
          const html = compiledTemplate({
            username: user.username,
            link: `${process.env.EMAIL_VERIFICATION_URL}/verify?token=${token}`
          });
          console.log("Email Html Template OK...")

          await  transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Verify Email",
            html,
          });
          console.log("Email VErification SENT OK...")
      
          res.status(201).send({ message: "Register OK" });
        } catch (err) {
          console.error("Register error:", err);
          res.status(500).send({ message: "Internal server error", error: err });
        }
      }
    
}

/*

curl -X POST http://localhost:8000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dianck",
    "email": "dianck2002@gmail.com",
    "password": "asd123"
  }'


*/