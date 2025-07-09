import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyTokenVerification } from "../middlewares/verify";

// import { verifyToken } from "../middlewares/verify";


export default class AuthRouter{
    private router :  Router;
    private authController : AuthController;

    constructor(){
        this.router = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post("/register", this.authController.register);
        this.router.patch(
            "/verify", 
            verifyTokenVerification, 
        this.authController.verify);
        this.router.post("/login", this.authController.login);
          
        
    }

    public getRouter(): Router{
        this.initializeRoutes();
        return this.router;
    }
}