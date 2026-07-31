import { SubscriberSchema } from '#database/schema'

export default class Subscriber extends SubscriberSchema {
  async unsubscribe() {
    this.active = false
    await this.save()
  }
}
