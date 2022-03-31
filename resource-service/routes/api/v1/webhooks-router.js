/**
 * Webhooks routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { WebhooksController } from '../../../controllers/api/webhooks-controller.js'

export const router = express.Router()

const webhooksController = new WebhooksController()

// Map HTTP verbs and route paths to controller actions.
router.post('/',
  (req, res, next) => webhooksController.authenticate(req, res, next),
  (req, res, next) => webhooksController.endPoint(req, res, next)
)

router.post('/add', (req, res, next) => webhooksController.addHook(req, res, next)
)
