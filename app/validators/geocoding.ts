import vine from '@vinejs/vine'

/**
 * Query for the "find coordinates" lookup in the article editor. The value
 * is a free form place name, optionally narrowed with a state and an ISO
 * 3166 country code: "Manila", "Manila,PH", "London,England,GB".
 */
export const geocodeValidator = vine.create({
  q: vine.string().trim().minLength(2).maxLength(200),
  /**
   * OpenWeather caps the direct geocoding response at 5 entries.
   */
  limit: vine.number().withoutDecimals().range([1, 5]).optional(),
})
