import factory from '@adonisjs/lucid/factories'
import Subscriber from '#models/subscriber'

export const SubscriberFactory = factory
  .define(Subscriber, async ({ faker }) => {
    return {}
  })
  .build()