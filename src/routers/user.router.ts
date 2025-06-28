import { Router } from "express";
import { UserController } from "../controllers/user.controller";
// import { verifyToken } from "../middlewares/verify";


export class UserRouter{
    private router :  Router;
    private userController : UserController;

    constructor(){
        this.router = Router();
        this.userController = new UserController();
    }

    private initializeRoutes(){
        this.router.post("/register", this.userController.register);
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