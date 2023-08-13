import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from '../../baseModule/baseSchema.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Blog } from '../../blog/entities/blog.entity';

@ObjectType()
@Entity('blog_post')
export class BlogPost extends BaseSchema {
  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  title: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  mainText: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isPublish: boolean;

  @Column({ type: 'varchar', nullable: true, array: true })
  @Field(() => [String])
  tags: string[];

  @ManyToOne(() => Blog, (blog) => blog.posts)
  @Field(() => Blog)
  blog: Blog;
}
