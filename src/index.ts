import cors from "cors";
import express, { Application, Request, Response } from 'express';
import { UserRouter } from "./routers/user.router";


const PORT: number = 8000;


const app: Application = express();
app.use(express.json())
app.use(cors()); 

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Welcom to My API!' })
    // res.send('Hello World!');
});

// Perbaikan: Hindari nama variabel yang sama dengan class
const userRouter = new UserRouter();
app.use("/api/user", userRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
