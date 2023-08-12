import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseSchema } from '../../baseModule/baseSchema.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { BlogPost } from '../../blog-post/entities/blog-post.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity('blog')
export class Blog extends BaseSchema {
  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  title: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  description: string;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.blog)
  @Field(() => [BlogPost], { nullable: true })
  posts?: BlogPost[];

  @ManyToOne(() => User, (user) => user.blogs)
  @Field(() => User, { nullable: false })
  author?: User;
}
