import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm'
import { User } from './User'

export enum RoleName {
  Admin = 'Admin',
  Audience = 'Audience',
  Wall = 'Wall',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column({
    type: 'enum',
    enum: RoleName,
    unique: true,
  })
  public name!: RoleName

  @ManyToMany(
    type => User,
    user => user.roles,
  )
  public users!: User[]

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  public readonly deletedAt?: Date
}
