import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Role } from './Role'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column({ nullable: true, unique: true })
  public fingerprint?: string

  @Column({ nullable: true, unique: true })
  public email?: string

  @Column({ nullable: true })
  public password?: string

  @Column({ nullable: true })
  public name?: string

  @Column({ default: false })
  public anonymous!: boolean

  @ManyToMany(
    type => Role,
    role => role.users,
  )
  @JoinTable({ name: 'userRoles' })
  roles!: Role[]

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  public readonly deletedAt?: Date
}
