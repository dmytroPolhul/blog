import { Column, Entity } from 'typeorm';
import { BaseSchema } from '../../baseModule/baseSchema.entity';

@Entity('blog')
export class BlogEntity extends BaseSchema {
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;
}
