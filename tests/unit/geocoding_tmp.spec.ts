import { test } from '@japa/runner'
import GeocodingService from '#services/geocoding_service'
import redis from '@adonisjs/redis/services/main'
import cache from '@adonisjs/cache/services/main'

test.group('geocoding (temporary)', (group) => {
  group.each.setup(async () => {
    await redis.del('geocoding:calls')
    await cache.deleteByTag({ tags: ['geocoding'] })
  })

  test('resolves a place name into coordinates', async ({ assert }) => {
    const service = new GeocodingService()
    const results = await service.search('London', 5)

    console.log('RESULTS', JSON.stringify(results, null, 2))
    assert.isAbove(results.length, 0)
    assert.isNumber(results[0].latitude)
    assert.isNumber(results[0].longitude)
    assert.isString(results[0].label)
  }).timeout(15000)

  test('repeat searches are served from cache without spending quota', async ({ assert }) => {
    const service = new GeocodingService()

    await service.search('Manila,PH', 5)
    const callsAfterFirst = await redis.zcard('geocoding:calls')

    await service.search('  manila , ph  ', 5)
    const callsAfterSecond = await redis.zcard('geocoding:calls')

    console.log('CALLS', callsAfterFirst, '->', callsAfterSecond)
    assert.equal(callsAfterFirst, 1)
    assert.equal(callsAfterSecond, 1)
  }).timeout(15000)

  test('refuses the 61st call inside the window', async ({ assert }) => {
    const service = new GeocodingService()

    const now = Date.now()
    for (let i = 0; i < 60; i++) {
      await redis.zadd('geocoding:calls', now, `filler:${i}`)
    }

    await assert.rejects(() => service.search('Tokyo,JP', 5), /Too many location lookups/)

    // Age the window out, the next call should be allowed through again
    await redis.del('geocoding:calls')
    const results = await service.search('Tokyo,JP', 5)
    assert.isAbove(results.length, 0)
  }).timeout(15000)
})
