import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from '../config/app-config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './guards';

const { database, host, port, password, username } = appConfig.typeOrm;

@Module({
   imports: [
      TypeOrmModule.forRoot({
         type: 'mysql',
         host,
         port,
         username,
         password,
         database,
         entities: ['./dist/**/*.entity{.ts,.js}'],
         logging: true,
         supportBigNumbers: true,
         bigNumberStrings: true,
         synchronize: true,
      }),
      UsersModule,
      AuthModule,
   ],
   providers: [
      {
         provide: APP_GUARD,
         useClass: AccessTokenGuard,
      },
   ],
})
export class AppModule {}
