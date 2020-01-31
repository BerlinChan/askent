import { shield } from 'graphql-shield'
import { typeRules } from './types'

export const permissions = shield(typeRules)
