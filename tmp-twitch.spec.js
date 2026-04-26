import { test } from '@playwright/test'

test('debug quantity twitch', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1400 })
  await page.goto('http://localhost:8080/events/019dc0b6-d748-719b-affa-edee7c2a6552?occurrence=2026-05-08&package=019dc0b6-d748-719b-affa-edee7c2a6552%3A22000000-0000-4000-8000-000000000003%3Adefault%3A019dc0b9-ed54-71ae-be21-ae88f0e939d2&tab=packages', { waitUntil: 'networkidle' })
  await page.locator('text=Quantity').waitFor()

  const capture = async (name) => {
    const data = await page.evaluate(() => {
      const quantityLabel = [...document.querySelectorAll('label')].find((el) => el.textContent.trim() === 'Quantity')
      const quantityCard = quantityLabel?.parentElement
      const paymentHeading = [...document.querySelectorAll('h3')].find((el) => el.textContent.trim() === 'Payment summary')
      const paymentCard = paymentHeading?.closest('div.rounded-xl')
      const fullAmount = [...document.querySelectorAll('span.text-2xl')].find((el) => el.textContent.includes('AED'))
      const updating = [...document.querySelectorAll('span')].find((el) => el.textContent.includes('Updating price'))
      const toData = (el) => el ? {
        text: el.textContent.trim(),
        rect: (() => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } })(),
        opacity: getComputedStyle(el).opacity,
        transition: getComputedStyle(el).transition,
        className: el.className,
      } : null
      return { quantityCard: toData(quantityCard), paymentCard: toData(paymentCard), fullAmount: toData(fullAmount), updating: toData(updating), bodyHeight: document.body.getBoundingClientRect().height }
    })
    console.log(name + '=' + JSON.stringify(data))
  }

  await capture('before')
  await page.getByRole('button', { name: 'Increase quantity' }).click()
  await capture('after_click_immediate')
  await page.waitForTimeout(50)
  await capture('after_50ms')
  await page.waitForTimeout(150)
  await capture('after_200ms')
  await page.waitForTimeout(600)
  await capture('after_800ms')
})