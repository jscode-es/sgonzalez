// Load Node JS modules
import dotenv from "dotenv"

// Initialize configuration
dotenv.config()

// Quick directories
import "./directories"
import error from "@controller/error"
import server from "@controller/server"

// Module error
error.listener()

// Launch server
export default new server(server.HTTP);