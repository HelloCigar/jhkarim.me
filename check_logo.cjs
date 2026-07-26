const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))

  await page.goto('http://localhost:52440', { waitUntil: 'networkidle' })
  await page.waitForSelector('svg text.signature-text', { timeout: 10000 })

  const text = await page.locator('svg text.signature-text').first()
  const content = await text.textContent()
  const dasharray = await text.evaluate((el) => getComputedStyle(el).strokeDasharray)
  const cssVar = await text.evaluate((el) => el.style.getPropertyValue('--signature-length'))

  console.log('text content:', JSON.stringify(content))
  console.log('computed stroke-dasharray:', dasharray)
  console.log('--signature-length set to:', cssVar)

  await page.screenshot({ path: 'logo_full_page.png' })
  const logoEl = page.locator('svg').first()
  await logoEl.screenshot({ path: 'logo_element.png' })

  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(1200)
    const offset = await text.evaluate((el) => getComputedStyle(el).strokeDashoffset)
    const fillOpacity = await text.evaluate((el) => getComputedStyle(el).fillOpacity)
    const opacity = await text.evaluate((el) => getComputedStyle(el).opacity)
    console.log(`t+${(i + 1) * 1.2}s -> dashoffset=${offset} fillOpacity=${fillOpacity} opacity=${opacity}`)
  }

  console.log('console/page errors:', errors)

  await browser.close()
})()
