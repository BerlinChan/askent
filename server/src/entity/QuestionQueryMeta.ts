import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm'
import { QuestionQueryInput } from '../graphql/Question'

@Entity()
export class QuestionQueryMeta {
  @PrimaryColumn({
    comment: "Id value is query's hash",
  })
  public id!: string

  @Column({ type: 'simple-json', unique: true })
  public query!: QuestionQueryInput

  @Column()
  public list!: string

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date
}
