import app from "./src/app.js"
import dotenv from "dotenv"
import config from "./src/config/config.js"
import { connectDB } from "./src/config/db.js";
import dns from 'dns'

// Use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDB() // Database se connect karne ke liye function call
dotenv.config()
const PORT = config.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// api/v1/auth//register