import { enumType } from 'nexus'

export const OrderByArg = enumType({
  name: 'OrderByArg',
  members: ['ASC', 'DESC'],
})
