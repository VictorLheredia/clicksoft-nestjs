import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.teacher.findMany();
  }

  async findOne(register: number) {
    return await this.prisma.teacher.findUnique({
      where: { register: register },
      include: { rooms: true },
    });
  }

  async create(data: Prisma.TeacherCreateInput) {
    return await this.prisma.teacher.create({
      data,
    });
  }

  async update(register: number, data: Prisma.TeacherUpdateInput) {
    return await this.prisma.teacher.update({
      data,
      where: { register: register },
    });
  }

  async delete(register: number) {
    await await this.prisma.teacher.delete({ where: { register: register } });
  }
}
