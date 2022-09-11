import {
   Column,
   CreateDateColumn,
   Entity,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;
   @CreateDateColumn()
   createdAt: Date;
   @UpdateDateColumn()
   updatedAt: Date;

   @Column({
      unique: true,
   })
   email: string;
   @Column()
   password: string;
   @Column({
      nullable: true,
   })
   refreshToken?: string;
}
