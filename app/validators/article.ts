import vine from '@vinejs/vine'

const articleSchema = {
  title: vine.string().minLength(3).maxLength(200),
  slug: vine
    .string()
    .unique({
      table: 'articles',
      column: 'slug',
    })
    .minLength(3)
    .maxLength(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: vine.string().maxLength(300).nullable().optional(),
  content: vine.string().nullable().optional(),
  coverImage: vine.string().maxLength(2048).nullable().optional(),
  locationName: vine.string().maxLength(200).nullable().optional(),
  latitude: vine.number().min(-90).max(90).nullable().optional(),
  longitude: vine.number().min(-180).max(180).nullable().optional(),
  published: vine.boolean().optional(),
}

/**
 * Validator to validate the payload when creating
 * a new article.
 */
export const createArticleValidator = vine.create(articleSchema)

/**
 * Validator to validate the payload when updating
 * an existing article.
 */
export const updateArticleValidator = vine.create({
  ...articleSchema,
  slug: vine
    .string()
    .minLength(3)
    .maxLength(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

/**
 * Both values end up in the cache key for the article list, so they are
 * bounded to keep the key space (and the page size hitting the database)
 * from being driven by arbitrary query string input.
 */
export const listArticleValidator = vine.create({
  page: vine.number().withoutDecimals().min(1).optional(),
  perPage: vine.number().withoutDecimals().range([1, 100]).optional(),
})
