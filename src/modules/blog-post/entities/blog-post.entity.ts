import { ObjectType, Field } from '@nestjs/graphql';
import {BaseSchema} from "../../baseModule/baseSchema.entity";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {Blog} from "../../blog/entities/blog.entity";

@ObjectType()
@Entity('blog_post')
export class BlogPost extends BaseSchema {
  @Column({ type: 'varchar', nullable: false })
  @Field(type => String)
  title: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(type => String)
  mainText: string;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  @Field(type => Blog)
  blog: Blog;
}
