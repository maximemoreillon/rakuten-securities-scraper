import puppeteer from "puppeteer"
import dotenv from "dotenv"
import { register } from "./registration"
dotenv.config()

const { RAKUTEN_SEC_USERNAME = "", RAKUTEN_SEC_PASSWORD = "" } = process.env

async function main() {
  const browser = await puppeteer.launch({ headless: "new" })
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

  await register(total)

  await browser.close()
}

main()
