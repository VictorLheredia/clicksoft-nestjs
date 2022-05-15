import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.student.findMany();
  }

  async findOne(register: number) {
    return await this.prisma.student.findUnique({
      where: { register: register },
      include: { rooms: true },
    });
  }

  async create(data: Prisma.StudentCreateInput) {
    return await this.prisma.student.create({
      data,
    });
  }

  async update(register: number, data: Prisma.StudentUpdateInput) {
    return await this.prisma.student.update({
      data,
      where: { register: register },
    });
  }

  async delete(register: number) {
    await await this.prisma.student.delete({ where: { register: register } });
  }
}
