import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.room.findMany({
      orderBy: {
        number: 'desc',
      },
    });
  }

  async findOne(number: number) {
    return await this.prisma.room.findUnique({
      where: { number: number },
      include: {
        Teacher: {
          select: {
            name: true,
            email: true,
          },
        },
        students: {
          select: {
            register: true,
            name: true,
            email: true,
          },
        },
        _count: { select: { students: true } },
      },
    });
  }

  async create(data: Prisma.RoomUncheckedCreateInput) {
    return await this.prisma.room.create({
      data: {
        number: data.number,
        capacity: data.capacity,
        available: data.available,
        teacherRegister: data.teacherRegister,
      },
    });
  }

  async update(number: number, data: Prisma.RoomUncheckedUpdateInput) {
    return await this.prisma.room.update({
      data: {
        number: data.number,
        capacity: data.capacity,
        available: data.available,
        teacherRegister: data.teacherRegister,
      },
      where: { number: number },
    });
  }

  async delete(number: number) {
    await this.prisma.room.delete({
      where: { number: number },
    });
  }

  async enroll(number: number, data: any) {
    await this.prisma.room.update({
      where: {
        number: number,
      },
      data: {
        students: {
          connect: [{ register: data.studentRegister }],
        },
      },
    });
  }

  async unenroll(number: number, data: any) {
    await this.prisma.room.update({
      where: {
        number: number,
      },
      data: {
        students: {
          disconnect: [{ register: data.studentRegister }],
        },
      },
    });
  }
}
