"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prismaTest_controller_1 = require("../controllers/prismaTest.controller");
const router = express_1.default.Router();
router.get('/test-prisma', prismaTest_controller_1.testPrismaConnection);
exports.default = router;
