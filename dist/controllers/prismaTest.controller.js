"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPrismaConnection = void 0;
// import { PrismaClient } from '@prisma/client';
const prisma_1 = require("../../generated/prisma"); // atau '../generated/prisma' tergantung struktur folder
const prisma = new prisma_1.PrismaClient();
const testPrismaConnection = async (req, res) => {
    try {
        // Ganti dengan model yang kamu punya di schema.prisma
        const users = await prisma.user.findMany({
            take: 1
        });
        res.status(200).json({
            message: '✅ Koneksi ke database berhasil.',
            exampleData: users,
        });
    }
    catch (error) {
        console.error('❌ Prisma connection error:', error);
        res.status(500).json({
            message: '❌ Gagal koneksi ke database.',
            error,
        });
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.testPrismaConnection = testPrismaConnection;
/**
 
curl -X GET http://localhost:8000/api/test-prisma
 
 */ 
