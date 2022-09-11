import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { CreateResponse } from '../types/users/users.responses';

@Injectable()
export class UsersService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   async create(dto: CreateUserDto): Promise<CreateResponse> {
      const { identifiers }: InsertResult = await this.dataSource
         .createQueryBuilder()
         .insert()
         .into(User)
         .values(dto)
         .execute();
      return {
         createdUserId: identifiers[0].id,
      };
   }

   async findByEmail(email: string): Promise<User | null> {
      return await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({ email })
         .getOne();
   }

   async findById(id: string): Promise<User | null> {
      return await this.dataSource
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where({ id })
        .getOne();
   }

   async updateById(id: string, dto: UpdateUserDto): Promise<any> {
      await this.dataSource
         .createQueryBuilder()
         .update(User)
         .set(dto)
         .where({ id })
         .execute();
   }
}
