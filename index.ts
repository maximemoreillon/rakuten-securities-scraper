import puppeteer, { Browser } from "puppeteer"
import dotenv from "dotenv"
import { register } from "./registration"
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

  // const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  await page.goto("https://www.rakuten-sec.co.jp/")
  await page.setViewport({ width: 1080, height: 1024 })

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

  await browser.close()
}

main()
