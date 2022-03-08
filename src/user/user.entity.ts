import { NodeWorker } from 'inspector';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column()
  image_url?: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column({ length: 500 })
  access_token: string;
  @Column({ length: 300 })
  refresh_token: string;
  @Column()
  user_type: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
