/**
 * API version 1 routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { DataController } from '../../../controllers/api/data-controller.js'
export const router = express.Router()
const controller = new DataController()

// Provide req.data to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadData(req, res, next, id))

// GET data
router.get('/all', (req, res, next) => controller.findAll(req, res, next))

// POST data
router.post('/', (req, res, next) => controller.addData(req, res, next))

// GET data/:id
router.get('/:id', (req, res, next) => controller.find(req, res, next))

// PUT data/:id
router.put('/:id', (req, res, next) => controller.update(req, res, next))

// PATCH data/:id
router.patch('/:id', (req, res, next) => controller.updatePartially(req, res, next))

// DELETE data/:id
router.delete('/:id', (req, res, next) => controller.delete(req, res, next))
