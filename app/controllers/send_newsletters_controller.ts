import Subscriber from '#models/subscriber'
import { sendNewsletterPayloadValidator, subscribeValidator } from '#validators/newsletter'
import type { HttpContext } from '@adonisjs/core/http'
import SendNewsletter from '../jobs/send_newsletter.ts'
import { urlFor } from '@adonisjs/core/services/url_builder'
import env from '#start/env'

export default class SendNewslettersController {
  async send({ request, response }: HttpContext) {
    const input = await request.validateUsing(sendNewsletterPayloadValidator)
    const siteUrl = env.get('APP_URL').replace(/\/$/, '')
    const subscribers = await Subscriber.query().where(Subscriber.$columns['0'], true)

    const payloads = subscribers.map((subscriber) => ({
      email: subscriber.email,
      ...input,
      unsubscribeUrl: `${siteUrl}/${urlFor('send_newsletters.unsubscribe', { id: subscriber.id })}`,
    }))

    await SendNewsletter.dispatchMany(payloads).toQueue('emails').group('newsletter')

    return response.ok({ message: 'Emails dispatched!' })
  }

  async subscribe({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(subscribeValidator)
    await Subscriber.create({ email })

    response.ok({ message: 'Subcribed!' })
  }

  async unsubscribe({ params }: HttpContext) {
    const subscriber = await Subscriber.findByOrFail(Subscriber.$columns[2], params.email)
    await subscriber.unsubscribe()
  }
}
