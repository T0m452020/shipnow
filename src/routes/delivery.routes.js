import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import deliveryController from "../controllers/delivery.controller.js";
import upload from "../middlewares/upload.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Gestión de entregas y seguimiento
 */

const router = Router();

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Obtener todas las entregas
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entregas
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 */

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "store", "driver"),
    deliveryController.getAll
);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: Obtener una entrega por ID
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Entrega no encontrada
 */

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "store", "driver"),
    deliveryController.getById
);

 /**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Crear una entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order
 *             properties:
 *               order:
 *                 type: string
 *                 example: 6ab245cc0b92bdf30ca36946
 *               driver:
 *                 type: string
 *                 example: 6ab23d49bc6c2214832c1806
 *               status:
 *                 type: string
 *                 example: En preparación
 *               priority:
 *                 type: string
 *                 example: normal
 *     responses:
 *       201:
 *         description: Entrega creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Orden o conductor no encontrado
 */

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "store"),
    deliveryController.create
);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   put:
 *     summary: Actualizar una entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driver:
 *                 type: string
 *                 example: 6ab23d49bc6c2214832c1806
 *               priority:
 *                 type: string
 *                 example: high
 *     responses:
 *       200:
 *         description: Entrega actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Entrega no encontrada
 */

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "store"),
    deliveryController.update
);

/**
 * @swagger
 * /api/deliveries/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - En preparación
 *                   - Despachado
 *                   - Enviado
 *                   - Recibido
 *                 example: Enviado
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado o ID inválido
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Entrega no encontrada
 */

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin", "driver"),
    deliveryController.updateStatus
);

/**
 * @swagger
 * /api/deliveries/{id}/proof:
 *   post:
 *     summary: Subir comprobante de entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - proof
 *             properties:
 *               proof:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JPG, PNG o PDF de hasta 5 MB
 *     responses:
 *       200:
 *         description: Comprobante subido correctamente
 *       400:
 *         description: Archivo inválido, faltante o demasiado grande
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Entrega no encontrada
 */

router.post(
    "/:id/proof",
    authMiddleware,
    roleMiddleware("admin", "driver"),
    upload.single("proof"),
    deliveryController.uploadProof
);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   delete:
 *     summary: Eliminar una entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     responses:
 *       204:
 *         description: Entrega eliminada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token de autenticación requerido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Entrega no encontrada
 */

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deliveryController.delete
);

export default router;