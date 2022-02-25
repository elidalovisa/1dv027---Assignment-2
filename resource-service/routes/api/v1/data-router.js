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
router.param('id', (req, res, next, username) => controller.loadData(req, res, next, username))

// GET all fishes from all users.
router.get('/users/fish', (req, res, next) => controller.findAll(req, res, next))

// POST add fish
router.post('/users/:id/fish', (req, res, next) => controller.addFish(req, res, next))

// GET /:id all fish from on e user
router.get('/users/:id/fish', (req, res, next) => controller.find(req, res, next))

// PUT data/:id
router.put('add-fish/:id', (req, res, next) => controller.update(req, res, next))

// PATCH data/:id
router.patch('/:id', (req, res, next) => controller.updatePartially(req, res, next))

// DELETE data/:id
router.delete('/users/:id/fish', (req, res, next) => controller.delete(req, res, next))
