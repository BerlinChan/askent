import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './User'
import { Question } from './Question'
import { ReviewStatus } from '../constant'

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column()
  public content!: string

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.Publish })
  public reviewStatus!: ReviewStatus

  @Column({ comment: 'If author is a moderator of the event?' })
  public isModerator!: boolean

  @Column()
  public anonymous!: boolean

  @ManyToOne((type) => Question, (question) => question.replies)
  public question!: Question

  @ManyToOne((type) => User, (user) => user.replies)
  public author!: User

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  public readonly deletedAt?: Date
}
