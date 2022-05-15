import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.teacher.findMany({
      orderBy: {
        register: 'desc',
      },
    });
  }

  async findOne(register: number) {
    return await this.prisma.teacher.findUnique({
      where: { register: register },
      include: {
        rooms: {
          select: {
            number: true,
            capacity: true,
            available: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });
  }

  async create(data: Prisma.TeacherCreateInput) {
    return await this.prisma.teacher.create({
      data: {
        register: data.register,
        name: data.name,
        email: data.email,
        birthdate: data.birthdate,
      },
    });
  }

  async update(register: number, data: Prisma.TeacherUpdateInput) {
    return await this.prisma.teacher.update({
      data: {
        register: data.register,
        name: data.name,
        email: data.email,
        birthdate: data.birthdate,
      },
      where: { register: register },
    });
  }

  async delete(register: number) {
    await this.prisma.teacher.delete({ where: { register: register } });
  }
}
