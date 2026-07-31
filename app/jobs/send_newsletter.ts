import { SendNewsletterService } from '#services/send_newsletter_service'
import { inject } from '@adonisjs/core'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

interface SendNewsletterPayload {
  email: string
  subject: string
  /**
   * The articles to feature, newest first in the email regardless of
   * the order they are passed in.
   */
  articleIds: number[]
  /**
   * Optional lead paragraph shown under the subject.
   */
  intro?: string
  unsubscribeUrl?: string
}

@inject()
export default class SendNewsletter extends Job<SendNewsletterPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  constructor(private sendNewsletterService: SendNewsletterService) {
    super()
  }

  async execute() {
    await this.sendNewsletterService.send(this.payload)
  }

  async failed(error: Error) {
    console.error('SendNewsletter failed:', error.message)
  }
}
