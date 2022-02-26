/**
 * API version 1 routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { DataController } from '../../../controllers/api/data-controller.js'
import jwt from 'jsonwebtoken'
import fs from 'fs'
export const router = express.Router()
const controller = new DataController()

// ------------------------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------------------------

const PermissionLevels = Object.freeze({
  READ: 1,
  CREATE: 2,
  UPDATE: 4,
  DELETE: 8
})

/**
 * Authenticates requests.
 *
 * If authentication is successful, `req.user`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticateJWT = (req, res, next) => {
  const authorization = req.headers.authorization?.split(' ')
  if (authorization?.[0] !== 'Bearer') {
    next(createError(401))
    return
  }

  try {
    const payload = jwt.verify(authorization[1], process.env.PERSONAL_ACCESS_TOKEN, {
      algorithm: 'RS256'
    })
    console.log(payload)
    req.user = {
      username: payload.username,
      email: payload.sub,
      permissionLevel: payload.permissionLevel
    }
    next()
  } catch (err) {
    next(createError(403))
  }
}

/**
 * Authorize requests.
 *
 * If authorization is successful, that is the user is granted access
 * to the requested resource, the request is authorized to continue.
 * If authentication fails, a forbidden response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {number} permissionLevel - ...
 */
const hasPermission = (req, res, next, permissionLevel) => {
  req.user?.permissionLevel & permissionLevel ? next() : next(createError(403))
}

// ------------------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------------------

// Provide req.data to the route if :username is present in the route path.
router.param('username', (req, res, next, username) => controller.loadData(req, res, next, username))

// Provide req.data to the route if :id is present in the route path.
//router.param('id', (req, res, next, id) => controller.loadDataID(req, res, next, id))

// GET all fishes from all users.

// GET
/*router.get('/users/fish',
 /* authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.READ),*/
 // (req, res, next) => controller.findAll(req, res, next)
//)
router.get('/users/fish', (req, res, next) => controller.findAll(req, res, next))

// POST add fish
router.post('/users/:id/fish', (req, res, next) => controller.addFish(req, res, next))

// GET /:id all fish from one user
router.get('/users/:username/fish', (req, res, next) => controller.find(req, res, next))

// GET /:id specific fish from one user
router.get('/users/:username/fish/:id', (req, res, next) => controller.findFish(req, res, next))

// PUT data/:id
router.put('add-fish/:id', (req, res, next) => controller.update(req, res, next))

// PATCH data/:id
router.patch('/:id', (req, res, next) => controller.updatePartially(req, res, next))

// DELETE data/:id
router.delete('/users/:username/fish/:id', (req, res, next) => controller.delete(req, res, next))
