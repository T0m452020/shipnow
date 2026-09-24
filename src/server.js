import app from "./app.js";
import env from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import logger from "./utils/logger/logger.js";

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(env.port, () => {
            logger.info(`ShipNow running on port ${env.port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();