import vine from '@vinejs/vine'

export const imageUploadValidator = vine.create({
  image: vine.file({
    size: '10mb',
    extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg'],
  }),
})
