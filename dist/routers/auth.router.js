"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const verify_1 = require("../middlewares/verify");
// import { verifyToken } from "../middlewares/verify";
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/register", this.authController.register);
        this.router.patch("/verify", verify_1.verifyTokenVerification, this.authController.verify);
    }
    getRouter() {
        this.initializeRoutes();
        return this.router;
    }
}
exports.default = AuthRouter;
