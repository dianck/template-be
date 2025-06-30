import express from 'express';
import { testPrismaConnection } from '../controllers/prismaTest.controller';

const router = express.Router();

router.get('/test-prisma', testPrismaConnection);

export default router;
