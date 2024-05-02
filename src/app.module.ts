import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceTypeORM } from './database/data-source';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/authentication.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...DataSourceTypeORM.options,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
