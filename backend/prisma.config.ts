import { defineConfig } from "prisma/config"
import { config } from 'dotenv';
config(); // Loads .env file

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
})
