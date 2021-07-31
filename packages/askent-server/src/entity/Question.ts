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
import { Event } from './Event'
import { Reply } from './Reply'
import { ReviewStatus } from '../constant'

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column()
  public content!: string

  @Column({ default: false })
  public anonymous?: boolean

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.Publish })
  public reviewStatus!: ReviewStatus

  @Column({ default: false })
  public star?: boolean

  @Column({ default: false })
  public top?: boolean

  @Column({ default: 0 })
  public voteUpCount?: number

  @Column({ default: 0 })
  public replyCount?: number

  @ManyToOne((type) => Event, (event) => event.questions)
  public event!: Event

  @ManyToOne((type) => User, (user) => user.questions)
  public author!: User

  @ManyToMany((type) => User, (user) => user.voteUpQuestions)
  @JoinTable({ name: 'usersVoteUpQuestions' })
  public voteUpUsers!: User[]

  @OneToMany((type) => Reply, (reply) => reply.question)
  public replies!: Reply[]

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  public readonly deletedAt?: Date
}
