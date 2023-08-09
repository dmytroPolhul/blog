import {Column, Entity, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import { BaseSchema } from '../../baseModule/baseSchema.entity';
import {Field, ObjectType} from "@nestjs/graphql";
import {BlogPost} from "../../blog-post/entities/blog-post.entity";
import {User} from "../../user/entities/user.entity";

@ObjectType()
@Entity('blog')
export class Blog extends BaseSchema {
  @Column({ type: 'varchar', nullable: false })
  @Field(type => String)
  title: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(type => String)
  description: string;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.blog)
  @Field(type => [BlogPost], { nullable: true })
  posts?: BlogPost[];

  @ManyToOne(() => User, (user) => user.blogs)
  @Field(type => User, { nullable: false })
  author?: User
}
