import { NodeWorker } from 'inspector';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  firstName: string
  lastName: string
  ImageUrl?: string

}
