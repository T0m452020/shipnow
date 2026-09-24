import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "ShipNow API",
        version: "1.0.0",
        description: "API backend para gestión de órdenes y entregas logísticas",
    },
    servers: [
        {
            url: "http://localhost:8080",
        },
    ],
    components: {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;