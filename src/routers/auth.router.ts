import { Router } from "express";
import AuthController from "../controllers/auth.controller";
// import { AuthController } from "../controllers/auth.controller";

// import { verifyToken } from "../middlewares/verify";


export default class AuthRouter{
    private router :  Router;
    private authController : AuthController;

    constructor(){
        this.router = Router();
        this.authController = new AuthController();
    }

    private initializeRoutes(){
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

    public getRouter(): Router{
        this.initializeRoutes();
        return this.router;
    }
}