import { InterfaceType, InputType, Field, Int } from 'type-graphql'
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from 'askent-common/src/constant'

@InputType()
export class PaginationInput {
  @Field(returns => Int, {
    defaultValue: DEFAULT_PAGE_OFFSET,
    description: 'Default offset 0.',
  })
  public offset!: number

  @Field(returns => Int, {
    defaultValue: DEFAULT_PAGE_LIMIT,
    description: `Default limit ${DEFAULT_PAGE_LIMIT}`,
  })
  public limit!: number
}

@InterfaceType({ resolveType: () => null })
export abstract class IPagedType {
  @Field(type => Int)
  public offset!: number

  @Field(type => Int)
  public limit!: number

  @Field(type => Int)
  public totalCount!: number

  @Field()
  public hasNextPage!: boolean
}
