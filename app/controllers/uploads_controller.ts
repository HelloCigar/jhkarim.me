import ArticlePolicy from '#policies/article_policy'
import drive from '@adonisjs/drive/services/main'
import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { imageUploadValidator } from '#validators/upload'

/**
 * Image uploads for articles. Files are written through AdonisJS Drive
 * (local filesystem service for now) and served from "/uploads/*".
 */
export default class UploadsController {
  /**
   * Public photo gallery of everything ever uploaded. Every upload is an
   * image (see the store validator), so the whole listing is shown.
   */
  async index({ request, inertia }: HttpContext) {
    const disk = drive.use()

    const response = await disk.listAll('/', {
      paginationToken: request.input('pagination_token'),
      recursive: true,
    })

    const photos = await Promise.all(
      Array.from(response.objects)
        .flatMap((object) => (object.isFile ? [object] : []))
        .map(async (file) => {
          const [url, meta] = await Promise.all([disk.getUrl(file.key), file.getMetaData()])
          return { key: file.key, url, lastModified: meta.lastModified.getTime() }
        })
    )

    photos.sort((a, b) => b.lastModified - a.lastModified)

    return inertia.render('photos', {
      photos: photos.map(({ key, url }) => ({ key, url })),
      /**
       * The local fs driver lists everything in one go, but paginated
       * drivers (S3, ...) hand back a token for the next page
       */
      nextToken: response.paginationToken ?? null,
    })
  }
  async store({ request, response, bouncer }: HttpContext) {
    await bouncer.with(ArticlePolicy).authorize('create')

    const { image } = await request.validateUsing(imageUploadValidator)

    const key = `${string.uuid()}.${image.extname}`
    const disk = drive.use()
    await disk.moveFromFs(image.tmpPath!, key)

    return response.json({ url: await disk.getUrl(key) })
  }
}
