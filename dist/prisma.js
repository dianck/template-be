"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
exports.default = new prisma_1.PrismaClient({ log: ["query", "info", "warn", "error"] });
