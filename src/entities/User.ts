import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, 
  BaseEntity, JoinTable, OneToMany, JoinColumn
} from 'typeorm';
import { Note } from './Note';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @OneToMany(() => Note, note => note.id, {cascade: true})
  list?: Note[];
  
}