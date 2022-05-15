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
import { TeacherService } from './teacher.service';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async findAll() {
    return this.teacherService.findAll();
  }

  @Get(':register')
  async findOne(@Param('register') register: string) {
    return this.teacherService.findOne(+register);
  }

  @Post()
  async create(@Body() data: Prisma.TeacherCreateInput) {
    return this.teacherService.create(data);
  }

  @Patch(':register')
  async update(
    @Param('register') register: string,
    @Body() data: Prisma.TeacherUpdateInput,
  ) {
    return this.teacherService.update(+register, data);
  }

  @Delete(':register')
  async delete(@Param('register') register: string) {
    return this.teacherService.delete(+register);
  }
}
