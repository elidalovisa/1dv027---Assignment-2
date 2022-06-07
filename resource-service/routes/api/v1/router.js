/**
 * API version 1 routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import { router as dataRouter } from './data-router.js'
import express from 'express'
export const router = express.Router()

router.use('/', dataRouter)
