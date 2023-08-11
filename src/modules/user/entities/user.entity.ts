import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from '../../baseModule/baseSchema.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../../../common/enums/userRole.enum';
import { Blog } from '../../blog/entities/blog.entity';
import { Exclude } from 'class-transformer';

@ObjectType()
@Entity('user')
export class User extends BaseSchema {
  @Column({ type: 'varchar', nullable: false })
  @Field((type) => String)
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  @Field((type) => String)
  lastName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @Field((type) => String)
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  @Field((type) => Boolean)
  status: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.WRITER })
  @Field((type) => Role)
  role: Role;

  @OneToMany(() => Blog, (blog) => blog.author)
  @Field((type) => [Blog], { nullable: true })
  blogs?: Blog[];
}
