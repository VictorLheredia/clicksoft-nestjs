import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.student.findMany({
      orderBy: {
        register: 'desc',
      },
    });
  }

  async findOne(register: number) {
    //Check student exists
    const studentExists = await this.prisma.student.findUnique({
      where: { register: register },
    });
    if (!studentExists) {
      throw new HttpException('Aluno não cadastrado', HttpStatus.NOT_FOUND);
    }

    return this.prisma.student.findUnique({
      where: { register: register },
      include: {
        rooms: {
          select: {
            number: true,
            Teacher: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });
  }

  async create(data: Prisma.StudentCreateInput) {
    // Check inputs
    if (!data.register) {
      throw new HttpException(
        'O campo ( Matrícula do aluno ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!data.name) {
      throw new HttpException(
        'O campo ( nome do aluno ) é obrigatório',
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

    //Check student exists
    const studentExists = await this.prisma.student.findUnique({
      where: { register: data.register },
    });
    if (studentExists) {
      throw new HttpException(
        `Matrícula ${data.register} já cadastrada`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.student.create({
      data: {
        register: data.register,
        name: data.name,
        email: data.email,
        birthdate: data.birthdate,
      },
    });
  }

  async update(register: number, data: Prisma.StudentUpdateInput) {
    //Check student exists
    const studentExists = await this.prisma.student.findUnique({
      where: { register: register },
    });
    if (!studentExists) {
      throw new HttpException(
        `Aluno não cadastrado`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.student.update({
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
    //Check student exists
    const studentExists = await this.prisma.student.findUnique({
      where: { register: register },
    });
    if (!studentExists) {
      throw new HttpException(
        `Aluno não cadastrado`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.student.delete({
      where: { register: register },
    });

    return {
      message: `Aluno ${studentExists.name} exlcuido com sucesso!`,
    };
  }
}
