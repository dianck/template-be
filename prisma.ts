import { PrismaClient } from "./generated/prisma";


export default new PrismaClient({log: ["query", "info", "warn", "error"]});