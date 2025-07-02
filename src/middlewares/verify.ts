import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorize!" });
    return;
  }

  verify(token, process.env.SECRET_KEY!, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        res.status(401).send({ message: "Token Expired" });
      } else {
        res.status(401).send({ message: "Invalid token" });
      }
      return;
    }

    res.locals.user = payload;
    next();
  });
};

export const verifyTokenVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorize!" });
    return;
  }

  verify(token, process.env.SECRET_KEY_VERIFY!, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        res.status(401).send({ message: "Token Expired" });
      } else {
        res.status(401).send({ message: "Invalid token" });
      }
      return;
    }

    res.locals.user = payload;
    res.locals.token = token;
    next();
  });
};
