import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export abstract class BaseSchema {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => String)
  id: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field((type) => Date)
  deletedAt: Date;
}
