import cors from "cors";
import express, { Application, Request, Response } from 'express';
import AuthRouter from "./routers/auth.router";
import testPrismaRouter from './routers/test.route';
// import { AuthRouter } from "./routers/auth.router";




const PORT: number = 8000;


const app: Application = express();
app.use(express.json())
app.use(cors()); 

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Welcom to My API!' })
    // res.send('Hello World!');
});

// Perbaikan: Hindari nama variabel yang sama dengan class
const authRouter = new AuthRouter();
app.use("/api/auth", authRouter.getRouter());

app.use('/api', testPrismaRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
