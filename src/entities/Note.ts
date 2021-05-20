import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne, 
  BaseEntity, JoinTable, JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class Note extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  done: boolean;

    @ManyToOne(() => User, user => user.id, {cascade: true})
    user?: User;
  
}