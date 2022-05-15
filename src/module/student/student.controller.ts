import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  @Get(':register')
  async findOne(@Param('register') register: string) {
    return this.studentService.findOne(+register);
  }

  @Post()
  async create(@Body() data: Prisma.StudentCreateInput) {
    return this.studentService.create(data);
  }

  @Patch(':register')
  async update(
    @Param('register') register: string,
    @Body() data: Prisma.StudentUpdateInput,
  ) {
    return this.studentService.update(+register, data);
  }

  @Delete(':register')
  async delete(@Param('register') register: string) {
    return this.studentService.delete(+register);
  }
}
