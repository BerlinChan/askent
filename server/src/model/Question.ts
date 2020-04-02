import {
  prop,
  getModelForClass,
  Ref,
  arrayProp,
  modelOptions,
} from '@typegoose/typegoose'
import { Event } from './Event'
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'

export enum ReviewStatus {
  Review = 'Review',
  Publish = 'Publish',
  Archive = 'Archive',
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Question extends TimeStamps {
  @prop({ required: true })
  public content!: string

  @prop({ default: false })
  public anonymous?: boolean

  @prop({ default: ReviewStatus.Publish, enum: ReviewStatus })
  public reviewStatus?: ReviewStatus

  @prop({ default: false })
  public star?: boolean

  @prop({ default: false })
  public top?: boolean

  @prop({ default: 0 })
  public voteUpCount?: number

  @prop({ required: true, ref: Event })
  public event!: Ref<Event>

  @prop({ required: true })
  public authorId!: string

  @arrayProp({ default: [], items: String })
  public voteUpUsers?: string[]
}

export const QuestionModel = getModelForClass(Question)
