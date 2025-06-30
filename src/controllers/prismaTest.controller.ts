import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../../generated/prisma'; // atau '../generated/prisma' tergantung struktur folder

const prisma = new PrismaClient();

export const testPrismaConnection = async (req: Request, res: Response) => {
  try {
    // Ganti dengan model yang kamu punya di schema.prisma
    const users = await prisma.user.findMany({
      take: 1
    });

    res.status(200).json({
      message: '✅ Koneksi ke database berhasil.',
      exampleData: users,
    });
  } catch (error) {
    console.error('❌ Prisma connection error:', error);
    res.status(500).json({
      message: '❌ Gagal koneksi ke database.',
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
};



/**
 
curl -X GET http://localhost:8000/api/test-prisma
 
 */