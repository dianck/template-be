"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenVerification = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     res.status(401).send({ message: "Unauthorize!" });
//     return;
//   }
//   verify(token, process.env.SECRET_KEY!, (err, payload) => {
//     if (err) {
//       if (err instanceof TokenExpiredError) {
//         res.status(401).send({ message: "Token Expired" });
//       } else {
//         res.status(401).send({ message: "Invalid token" });
//       }
//       return;
//     }
//     res.locals.user = payload;
//     next();
//   });
// };
const verifyTokenVerification = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).send({ message: "Unauthorize!" });
        return;
    }
    (0, jsonwebtoken_1.verify)(token, process.env.SECRET_KEY_VERIFY, (err, payload) => {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                res.status(401).send({ message: "Token Expired" });
            }
            else {
                res.status(401).send({ message: "Invalid token" });
            }
            return;
        }
        res.locals.user = payload;
        res.locals.token = token;
        next();
    });
};
exports.verifyTokenVerification = verifyTokenVerification;
