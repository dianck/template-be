import { Request, Response } from "express";
// import prisma from "../../prisma";
import { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import Handlebars from "handlebars";
import { transporter } from "../helpers/mailer";
import fs from "fs";
import path from "path";
import prisma from "../prisma";

const isDebug = process.env.DEBUG === "false";
function logDebug(message: string, ...optionalParams: any[]) {
  if (isDebug) {
    console.log("[DEBUG]", message, ...optionalParams);
  }
}

export default class AuthController{



  async register(req: Request, res: Response) {
      try {

        logDebug("BODY", req.body);
        const { username, email, password} = req.body;

        if (!username || !email || !password ) {
          res.status(400).send({ message: "All fields are required" });
          return; 
        }

      
        logDebug("FIELD CHECK OK...");

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          res.status(409).send({ message: "Email already registered" });
          return;
        }
        logDebug("DATA EXIST CHECK OK...");
    
        logDebug("Registering user...");
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);


        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });

        logDebug("REGISTER CHECK OK...");


        //token untuk registrasi
        const payload = { id: user.id };
        const token = sign(payload, process.env.SECRET_KEY_VERIFY!, { expiresIn: "10m" });

        logDebug("TOKEN Generated OK...");
    
        const expiredAt = new Date (Date.now() + 10 * 60 * 1000)
        await prisma.email_verifications.create({
            data: {userId: user.id, token, expiredAt},
        });


        logDebug("Email VErification insertion OK...");

        const templatePath = path.join(__dirname, "../templates", "verify.hbs");
        if (!fs.existsSync(templatePath)) {
          res.status(500).send({ message: "Email template not found" });
          return;
        }
    
        logDebug("Email TEMPLATE PATH OK...");
        

        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(templateSource);
        const html = compiledTemplate({
          username: user.username,
          link: `${process.env.EMAIL_VERIFICATION_URL}/verify?token=${token}`
        });
        logDebug("Email Html Template OK...");

        await  transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: "Verify Email",
          html,
        });
        logDebug("Email Verification SENT OK...");
    
        res.status(201).send({ message: "Register OK" });
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).send({ message: "Internal server error", error: err });
      }
  }

      
  async verify(req: Request, res: Response){
    console.log("TOKEN VERIFICATION");
    try{
      const { id } = res.locals?.user;
      const token  = res.locals?.token;

      const data = await prisma.email_verifications.findFirst({
        where: {token, userId: id},
      })

      if(!data) throw {message: "Invalid link verification "};

      await prisma.user.update({
        data: {isVerified: true},
        where: {id},
      })

      await prisma.email_verifications.delete({
        where: {id: data.id}
      });

      res.status(200).send({message: "Verification Successfully"});

    }catch(err){
      console.log(err);
      res.status(400).send(err);
    }
  }

}

/*

curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "budi",
    "email": "hapegyjo@forexnews.bg",
    "password": "asd123"
  }'


*/