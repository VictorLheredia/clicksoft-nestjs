import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.student.findMany();
  }

  async findOne(register: number) {
    return this.prisma.student.findUnique({
      where: { register: register },
      include: { rooms: true },
    });
  }

  async create(data: Prisma.StudentCreateInput) {
    return this.prisma.student.create({
      data,
    });
  }

  async update(register: number, data: Prisma.StudentUpdateInput) {
    return this.prisma.student.update({
      data,
      where: { register: register },
    });
  }

  async delete(register: number) {
    await this.prisma.student.delete({ where: { register: register } });
  }
}
