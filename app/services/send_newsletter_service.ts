import Article from '#models/article'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import { urlFor } from '@adonisjs/core/services/url_builder'

interface SendNewsletterPayload {
  email: string
  subject: string
  articleIds: number[]
  intro?: string
  unsubscribeUrl?: string
}

export class SendNewsletterService {
  async getData(payload: SendNewsletterPayload) {
    const { subject, articleIds, intro, unsubscribeUrl } = payload

    const articles = await Article.query()
      .whereIn('id', articleIds)
      .whereNotNull('publishedAt')
      .orderBy('publishedAt', 'desc')

    if (articles.length === 0) {
      return
    }

    const siteUrl = env.get('APP_URL').replace(/\/$/, '')

    const data = {
      subject,
      intro,
      unsubscribeUrl,
      siteUrl,
      siteName: env.get('MAIL_FROM_NAME'),
      articles: articles.map((article) => ({
        title: article.title,
        excerpt: article.excerpt,
        locationName: article.locationName,
        url: `${siteUrl}/${urlFor('articles.show', { id: article.id })}`,
        publishedAt: article.publishedAt!.toFormat('LLL d, yyyy'),
        /**
         * Cover images come from Drive, which hands back a root-relative
         * path on the local disk driver. Email clients have no origin to
         * resolve that against, so they need the absolute URL.
         */
        coverImage: article.coverImage?.startsWith('http')
          ? article.coverImage
          : article.coverImage && `${siteUrl}${article.coverImage}`,
      })),
    }

    return data
  }

  async send(payload: SendNewsletterPayload) {
    const { email, subject, unsubscribeUrl } = payload

    const data = await this.getData(payload)

    await mail.send((message) => {
      message
        .to(email)
        .subject(subject)
        .htmlView('emails/newsletter', data)
        .textView('emails/newsletter_text', data)

      if (unsubscribeUrl) {
        /**
         * Gmail and friends surface this as a native "Unsubscribe" button
         * next to the sender name.
         */
        message.header('List-Unsubscribe', `<${unsubscribeUrl}>`)
        message.header('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click')
      }
    })
  }
}
