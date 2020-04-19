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

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string

  @Column()
  public content!: string

  @Column({ comment: 'If author is a moderator of the event?' })
  public isModerator!: boolean

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
