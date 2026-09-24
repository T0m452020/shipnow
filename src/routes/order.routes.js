import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import orderController from "../controllers/order.controller.js";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 */

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "store"),
    orderController.getAll
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Orden no encontrada
 */

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "store", "customer"),
    orderController.getById
);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - deliveryAddress
 *             properties:
 *               items:
 *                 type: array
 *                 description: Productos incluidos en la orden
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - price
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Fernet
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     price:
 *                       type: number
 *                       minimum: 0
 *                       example: 20000
 *               deliveryAddress:
 *                 type: string
 *                 example: San Luis 456
 *               priority:
 *                 type: string
 *                 enum: [normal, high]
 *                 example: normal
 *     responses:
 *       201:
 *         description: Orden creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Solo los clientes pueden crear órdenes
 *       404:
 *         description: Cliente no encontrado
 */

router.post(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    orderController.create
);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Actualizar una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 description: Productos incluidos en la orden
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - price
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Fernet
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     price:
 *                       type: number
 *                       minimum: 0
 *                       example: 20000
 *               deliveryAddress:
 *                 type: string
 *                 example: San Luis 456
 *               status:
 *                 type: string
 *                 example: created
 *               priority:
 *                 type: string
 *                 enum: [normal, high]
 *                 example: high
 *     responses:
 *       200:
 *         description: Orden actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Orden no encontrada
 */

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "store"),
    orderController.update
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Eliminar una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       204:
 *         description: Orden eliminada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Orden no encontrada
 */

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "store"),
    orderController.delete
);

export default router;