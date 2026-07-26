import { client } from '~/client'

/**
 * Upload an image to the admin uploads endpoint and return its public URL.
 * Uses the XSRF cookie set by @adonisjs/shield for CSRF protection.
 */
export async function uploadImage(file: File): Promise<string> {
  const [data, err] = await client.api.uploads.store({ body: { image: file } }).safe()

  if (err) {
    if (err.isValidationError())
      throw new Error(err.response.errors.map((e) => e.message).join(', '))
    if (err.isStatus(403)) throw new Error('Not allowed')
    throw new Error(err.status?.toString() ?? `Upload failed (${err.status})`)
  }

  const { url } = data
  return url
}

/**
 * Open a file picker and resolve with the chosen image file (or null).
 */
export function pickImage(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => resolve(input.files?.[0] ?? null)
    input.oncancel = () => resolve(null)
    input.click()
  })
}
