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
} from 'typeorm'
import { User } from './User'
import { Event } from './Event'

export enum ReviewStatus {
  Review = 'Review',
  Publish = 'Publish',
  Archive = 'Archive',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column()
  public content!: string

  @Column({ default: false })
  public anonymous?: boolean

  @Column({ enum: ReviewStatus, default: ReviewStatus.Publish })
  public reviewStatus!: ReviewStatus

  @Column({ default: false })
  public star?: boolean

  @Column({ default: false })
  public top?: boolean

  @Column({ default: 0 })
  public voteUpCount?: number

  @ManyToOne((type) => Event, (event) => event.questions)
  public event!: Event

  @ManyToOne((type) => User, (user) => user.questions)
  public author!: User

  @ManyToMany((type) => User, (user) => user.voteUpQuestions)
  @JoinTable({ name: 'usersVoteUpQuestions' })
  public voteUpUsers!: User[]

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  public readonly deletedAt?: Date
}
