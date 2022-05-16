import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.room.findMany({
      orderBy: {
        number: 'desc',
      },
    });
  }

  async findOne(number: number) {
    //Check room exists
    const roomExists = await this.prisma.room.findUnique({
      where: { number: number },
    });
    if (!roomExists) {
      throw new HttpException('Sala não cadastrada', HttpStatus.NOT_FOUND);
    }

    return this.prisma.room.findUnique({
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
    // Check inputs
    if (!data.number) {
      throw new HttpException(
        'O campo ( Numero da sala ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!data.capacity) {
      throw new HttpException(
        'O campo ( Capacidade de alunos ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!data.available) {
      throw new HttpException(
        'O campo ( disponibilidade de novas matrículas ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!data.teacherRegister) {
      throw new HttpException(
        'O campo ( Professor responsável ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check number room exists
    const numberRoomExists = await this.prisma.room.findUnique({
      where: { number: data.number },
    });
    if (numberRoomExists) {
      throw new HttpException(
        `Sala ${data.number} já cadastrada!`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check teacherRegister exists
    const teacherRegisterExists = await this.prisma.teacher.findUnique({
      where: { register: data.teacherRegister },
    });
    if (!teacherRegisterExists) {
      throw new HttpException(
        'Professor não cadastrado',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.room.create({
      data: {
        number: data.number,
        capacity: data.capacity,
        available: data.available,
        teacherRegister: data.teacherRegister,
      },
    });
  }

  async update(number: number, data: Prisma.RoomUncheckedUpdateInput) {
    //Check number room exists
    const numberRoomExists = await this.prisma.room.findUnique({
      where: { number: number },
    });
    if (!numberRoomExists) {
      throw new HttpException(
        'Sala não cadastrada',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.room.update({
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
    //Check room exists
    const roomExists = await this.prisma.room.findUnique({
      where: { number: number },
    });
    if (!roomExists) {
      throw new HttpException(
        `Sala não cadastrada`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.room.delete({
      where: { number: number },
    });

    return {
      message: `Sala ${roomExists.number} exlcuida com sucesso!`,
    };
  }

  async enroll(number: number, data: any) {
    //Check inputs
    if (!data.teacherRegister) {
      throw new HttpException(
        'O campo ( Professor responsável ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!data.studentRegister) {
      throw new HttpException(
        'O campo ( Matrícula do aluno ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const room = await this.prisma.room.findUnique({
      where: { number: number },
    });

    const student = await this.prisma.student.findUnique({
      where: { register: data.studentRegister },
    });

    //Check room exists
    if (!room) {
      throw new HttpException(
        `Sala não cadastrada.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check teacher is admin room
    if (data.teacherRegister !== room.teacherRegister) {
      throw new HttpException(
        `O professor informado não é o responsável da sala.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check available
    if (!room.available) {
      throw new HttpException(
        `A sala está temporariamente indisponível para novas matrículas.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check student exists
    if (!student) {
      throw new HttpException(
        `Aluno não cadastrado.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check Student exists in Room
    const students = await this.prisma.room.findUnique({
      where: { number: number },
      select: {
        students: {
          select: {
            register: true,
          },
        },
      },
    });
    const arrayStudents = students.students.map((student) => student.register);
    const studentInRoom = arrayStudents.includes(student.register);
    if (studentInRoom) {
      throw new HttpException(
        `O aluno Já está matriculado na sala.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check capacity Room
    if (room.capacity === arrayStudents.length) {
      throw new HttpException(
        `a Sala atingiu a capacidade máxima de ${room.capacity} alunos.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.room.update({
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
    //Check inputs
    if (!data.teacherRegister) {
      throw new HttpException(
        'O campo ( Professor responsável ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!data.studentRegister) {
      throw new HttpException(
        'O campo ( Matrícula do aluno ) é obrigatório',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const room = await this.prisma.room.findUnique({
      where: { number: number },
    });

    const student = await this.prisma.student.findUnique({
      where: { register: data.studentRegister },
    });

    //Check room exists
    if (!room) {
      throw new HttpException(
        `Sala não cadastrada.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check teacher is admin room
    if (data.teacherRegister !== room.teacherRegister) {
      throw new HttpException(
        `O professor informado não é o responsável da sala.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check student exists
    if (!student) {
      throw new HttpException(
        `Aluno não cadastrado.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check Student exists in Room
    const students = await this.prisma.room.findUnique({
      where: { number: number },
      select: {
        students: {
          select: {
            register: true,
          },
        },
      },
    });
    const arrayStudents = students.students.map((student) => student.register);
    const studentInRoom = arrayStudents.includes(student.register);
    if (!studentInRoom) {
      throw new HttpException(
        `O aluno não está matriculado na sala.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

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

    return {
      message: `O aluno ${student.name} foi removido da sala ${room.number} com sucesso!`,
    };
  }
}
