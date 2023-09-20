import puppeteer, { Browser } from "puppeteer"
import dotenv from "dotenv"
import { register } from "./registration"
import { logger } from "./logger"
import { version } from "./package.json"
dotenv.config()

const { RAKUTEN_SEC_USERNAME = "", RAKUTEN_SEC_PASSWORD = "" } = process.env

console.log(`Rakuten Securities scraper v${version}`)

async function main() {
  let browser: Browser

  try {
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  } catch {
    browser = await puppeteer.launch({ headless: "new" })
  }

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })
    await page.goto("https://www.rakuten-sec.co.jp")
    await page.type("#form-login-id", RAKUTEN_SEC_USERNAME)
    await page.type("#form-login-pass", RAKUTEN_SEC_PASSWORD)
    await page.click("#login-btn")

    await page.waitForNavigation()

    const totalContainer: any = await page.$("#asset_total_amount")
    const totalString: string = await (
      await totalContainer.getProperty("textContent")
    ).jsonValue()

    const total = Number(totalString.replace(/,/g, ""))

    console.log(`Scraped total assets: ${total}`)

    await register(total)

    logger.info({
      message: `Successfully scraped total assets`,
    })
  } catch (error) {
    logger.error({
      message: `Scraping failed`,
    })
    throw error
  } finally {
    await browser.close()
    logger.close()
  }
}

main()
