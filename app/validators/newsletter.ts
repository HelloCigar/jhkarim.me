import vine from '@vinejs/vine'

export const sendNewsletterPayloadValidator = vine.create({
  subject: vine.string(),
  articleIds: vine.array(vine.number()),
  intro: vine.string().optional(),
})

export const subscribeValidator = vine.create({
  email: vine.string().email().unique({
    table: 'subscribers',
    column: 'email',
  }),
})
