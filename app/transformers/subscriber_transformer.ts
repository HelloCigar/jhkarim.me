import { BaseTransformer } from '@adonisjs/core/transformers'
import type Subscriber from '#models/subscriber'

export default class SubscriberTransformer extends BaseTransformer<Subscriber> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}
