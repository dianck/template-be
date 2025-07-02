"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
// import AuthRouter from "./routers/auth.router";
// import { AuthRouter } from "./routers/auth.router";
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/api', (req, res) => {
    res.status(200).send({ message: 'Welcom to My API!' });
    // res.send('Hello World!');
});
// Perbaikan: Hindari nama variabel yang sama dengan class
const authRouter = new auth_router_1.default();
app.use("/api/auth", authRouter.getRouter());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
