import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { Role } from './Role'
import { Event } from './Event'
import { Question } from './Question'
import { Reply } from './Reply'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column({ nullable: true, unique: true })
  public fingerprint?: string

  @Column({ nullable: true, unique: true })
  public email?: string

  @Column({ nullable: true, unique: true })
  public avatar?: string

  @Column({ nullable: true })
  public password?: string

  @Column({ nullable: true })
  public name?: string

  @Column({ default: false })
  public anonymous!: boolean

  @ManyToMany((type) => Role, (role) => role.users)
  public roles!: Role[]

  @OneToMany((type) => Event, (event) => event.owner)
  public events!: Event[]

  @ManyToMany((type) => Event, (event) => event.audiences)
  public attendedEvents!: Event[]

  @ManyToMany((type) => Event, (event) => event.guestes)
  public guestEvents!: Event[]

  @OneToMany((type) => Question, (question) => question.author)
  public questions!: Question[]

  @ManyToMany((type) => Question, (question) => question.voteUpUsers)
  public voteUpQuestions!: Question[]

  @OneToMany((type) => Reply, (reply) => reply.author)
  public replies!: Reply[]

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  public readonly deletedAt?: Date
}
