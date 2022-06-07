/**
 * API version 1 routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { router as accountRouter } from './account-router.js'

export const router = express.Router()
router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API! (Auth)' }))

router.use('/', accountRouter)
