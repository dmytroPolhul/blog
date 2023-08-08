import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AppConfigModule} from "./config/appConfig.module";
import {DatabaseModule} from "./database/database.module";
import {BlogModule} from "./modules/blog/blog.module";

@Module({
  imports: [AppConfigModule, DatabaseModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
