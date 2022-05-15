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
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll() {
    return this.roomService.findAll();
  }

  @Get('number')
  async findOne(@Param('number') number: string) {
    return this.roomService.findOne(+number);
  }

  @Post()
  async create(@Body() data: Prisma.RoomCreateInput) {
    return this.roomService.create(data);
  }

  @Patch('number')
  async update(
    @Param('number') number: string,
    @Body() data: Prisma.RoomUpdateInput,
  ) {
    return this.roomService.update(+number, data);
  }

  @Delete('number')
  async delete(@Param('number') number: string) {
    return this.roomService.delete(+number);
  }
}
