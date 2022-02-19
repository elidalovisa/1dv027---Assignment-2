/**
 * API version 1 routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import { router as dataRouter } from './data-router.js'
import express from 'express'
export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple API!' }))
router.use('/', dataRouter)
