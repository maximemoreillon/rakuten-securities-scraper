import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const { FINANCES_API_URL, FINANCES_API_TOKEN, FINANCES_API_ACCOUNT_ID } =
  process.env

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FINANCES_API_TOKEN}`,
  },
  timeout: 3000,
}

export const register = (balance: number) => {
  const url = `${FINANCES_API_URL}/accounts/${FINANCES_API_ACCOUNT_ID}/balance`

  const body = {
    balance,
    currency: "JPY",
  }

  return axios.post(url, body, options)
}
