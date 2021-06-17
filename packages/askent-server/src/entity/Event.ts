import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { User } from './User'
import { Question } from './Question'

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column({ unique: true })
  public code!: string

  @Column()
  public name!: string

  @Column()
  public startAt!: Date

  @Column()
  public endAt!: Date

  @Column({ nullable: true, default: false })
  public moderation?: boolean

  @ManyToOne((type) => User, (user) => user.events)
  public owner!: User

  @ManyToMany((type) => User, (user) => user.guestEvents)
  @JoinTable({ name: 'eventGuestes' })
  public guestes!: User[]

  @ManyToMany((type) => User, (user) => user.attendedEvents)
  @JoinTable({ name: 'eventAudiences' })
  public audiences!: User[]

  @OneToMany((type) => Question, (question) => question.event)
  public questions!: Question[]

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  public readonly deletedAt?: Date
}
