import express from "express";

import env from "./config/env.js";

import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import mockRouter from "./routes/mock.routes.js";

import requestLoggerMiddleware from "./middlewares/requestLogger.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import globalErrorMiddleware from "./middlewares/globalError.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(requestLoggerMiddleware);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/mocks", mockRouter);

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        environment: env.nodeEnv,
    });
});



// 404
app.use(notFoundMiddleware);

// Global errors
app.use(globalErrorMiddleware);

export default app;