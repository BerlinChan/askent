import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm'
import { ReplyQueryInput } from '../graphql/Reply'
import { RoleName } from '../constant'

@Entity()
export class ReplyQueryMeta {
  @PrimaryColumn({ comment: "Id value is query's hash" })
  public id!: string

  @Column({ type: 'simple-json', unique: true })
  public query!: ReplyQueryInput & { userId: string; asRole: RoleName }

  @Column()
  public list!: string

  @CreateDateColumn()
  public readonly createdAt!: Date

  @UpdateDateColumn()
  public readonly updatedAt!: Date
}
