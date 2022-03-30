/**
 * The routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as v1Router } from './api/v1/router.js'

export const router = express.Router()

//router.use('/api/v1', v1Router)
router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API! (Auth)' }))

// Catch 404 (ALWAYS keep this as the last route).
//router.use('*', (req, res, next) => next(createError(404)))
