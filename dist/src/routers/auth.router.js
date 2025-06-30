"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
// import { AuthController } from "../controllers/auth.controller";
// import { verifyToken } from "../middlewares/verify";
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
    }
    initializeRoutes() {
        this.router.post("/register", this.authController.register);
        // this.router.get("/", verifyToken , this.userController.getUsers);
        // this.router.get("/:id", this.userController.getUserById);
        // this.router.delete("/:id", async (req, res, next) => {
        //     try {
        //         await this.userController.deleteUser(req, res);
        //     } catch (error) {
        //         next(error); // lempar ke error handler middleware jika ada
        //     }
        // });
        // this.router.put("/:id", async (req, res) => {
        //     await this.userController.updateUser(req, res);
        //   });
    }
    getRouter() {
        this.initializeRoutes();
        return this.router;
    }
}
exports.default = AuthRouter;
