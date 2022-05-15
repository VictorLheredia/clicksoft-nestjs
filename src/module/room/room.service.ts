import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.room.findMany();
  }

  async findOne(number: number) {
    return await this.prisma.room.findUnique({
      where: { number: number },
    });
  }

  async create(data: Prisma.RoomCreateInput) {
    return await this.prisma.room.create({
      data,
    });
  }

  async update(number: number, data: Prisma.RoomUpdateInput) {
    return await this.prisma.room.update({
      data,
      where: { number: number },
    });
  }

  async delete(number: number) {
    await this.prisma.room.delete({
      where: { number: number },
    });
  }
}
