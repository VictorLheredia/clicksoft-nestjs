import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teacher.findMany({
      orderBy: {
        register: 'desc',
      },
    });
  }

  async findOne(register: number) {
    //Check Teacher exists
    const teacherExists = await this.prisma.teacher.findUnique({
      where: { register: register },
    });
    if (!teacherExists) {
      throw new HttpException('Professor não cadastrado', HttpStatus.NOT_FOUND);
    }

    return this.prisma.teacher.findUnique({
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
    // Check inputs
    if (!data.register) {
      throw new HttpException(
        'O campo ( Matrícula do professor ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!data.name) {
      throw new HttpException(
        'O campo ( nome do professor ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!data.email) {
      throw new HttpException(
        'O campo ( email ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!data.birthdate) {
      throw new HttpException(
        'O campo ( data de Nascimento ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check teacher exists
    const teacherExists = await this.prisma.teacher.findUnique({
      where: { register: data.register },
    });
    if (teacherExists) {
      throw new HttpException(
        `Matrícula ${data.register} já cadastrada`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.teacher.create({
      data: {
        register: data.register,
        name: data.name,
        email: data.email,
        birthdate: data.birthdate,
      },
    });
  }

  async update(register: number, data: Prisma.TeacherUpdateInput) {
    //Check teacher exists
    const teacherExists = await this.prisma.teacher.findUnique({
      where: { register: register },
    });
    if (!teacherExists) {
      throw new HttpException(
        `Professor não cadastrado`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.teacher.update({
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
    //Check teacher exists
    const teacherExists = await this.prisma.teacher.findUnique({
      where: { register: register },
    });
    if (!teacherExists) {
      throw new HttpException(
        `Professor não cadastrado`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.teacher.delete({
      where: { register: register },
    });

    return {
      message: `Professor ${teacherExists.name} exlcuido com sucesso!`,
    };
  }
}
