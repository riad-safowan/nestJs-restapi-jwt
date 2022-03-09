import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 2000 })
  text: string;
  @Column()
  user_id: number;
  @Column({ nullable: true })
  image_url?: string;
  @Column({ default: 0 })
  likes: number;
  @Column({ default: 0 })
  comments: number;
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

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  post_id: number;
  @Column()
  user_id: number;
  @Column({ default: false })
  is_liked: boolean;

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

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  post_id: number;
  @Column()
  user_id: number;
  @Column({ length: 500 })
  text: string;
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
