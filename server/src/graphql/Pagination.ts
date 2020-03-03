import { inputObjectType, interfaceType } from 'nexus'
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from '../constant'

export const PaginationInputType = inputObjectType({
  name: 'PaginationInputType',
  description: 'Pagination input type.',
  definition(t) {
    t.int('offset', {
      default: DEFAULT_PAGE_OFFSET,
      required: true,
      description: 'Default offset 0.',
    })
    t.int('limit', {
      default: DEFAULT_PAGE_LIMIT,
      required: true,
      description: `Default limit ${DEFAULT_PAGE_LIMIT}`,
    })
  },
})
export const IPagedType = interfaceType({
  name: 'IPagedType',
  definition(t) {
    t.int('offset')
    t.int('limit')
    t.int('totalCount')
    t.boolean('hasNextPage')
    t.resolveType(() => null)
  },
})
