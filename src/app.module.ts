import { Module } from '@nestjs/common';
import { StudentModule } from './module/student/student.module';
import { TeacherModule } from './module/teacher/teacher.module';
import { RoomModule } from './module/room/room.module';

@Module({
  imports: [StudentModule, TeacherModule, RoomModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
