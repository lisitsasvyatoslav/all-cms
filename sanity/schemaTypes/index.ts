import { type SchemaTypeDefinition } from 'sanity'

import {colorType} from './colorType'
import {componentType} from './componentType'
import {iconType} from './iconType'
import {noteType} from './noteType'
import {portalSourceType} from './portalSourceType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [componentType, colorType, iconType, noteType, portalSourceType],
}
