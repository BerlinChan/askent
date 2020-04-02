import {
  prop,
  getModelForClass,
  arrayProp,
  modelOptions,
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Event extends TimeStamps {
  @prop({ required: true, unique: true })
  public code!: string

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public startAt!: Date

  @prop({ required: true })
  public endAt!: Date

  @prop({ default: false })
  public moderation?: boolean

  @prop()
  public ownerId!: string

  @arrayProp({ default: [], items: String })
  public audienceIds?: string[]
}

export const EventModel = getModelForClass(Event)
