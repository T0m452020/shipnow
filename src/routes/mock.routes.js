import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import MockController from "../controllers/mock.controller.js";

/**
 * @swagger
 * tags:
 *   name: Mocks
 *   description: Generación de datos de prueba
 */

const router = Router();

/**
 * @swagger
 * /api/mocks/users/{quantity}:
 *   get:
 *     summary: Generar usuarios de prueba
 *     tags: [Mocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quantity
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad de usuarios a generar
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuarios generados correctamente
 *       400:
 *         description: Cantidad inválida
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 */

router.get(
    "/users/:quantity",
    authMiddleware,
    roleMiddleware("admin"),
    MockController.generateUsers
);

export default router;