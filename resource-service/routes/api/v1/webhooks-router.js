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
      algorithm: 'HS256' // 'RS256'
    })
    req.user = {
      username: payload.username,
      email: payload.email,
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
// Map HTTP verbs and route paths to controller actions.
router.get('/',
 // (req, res, next) => hasPermission(req, res, next, PermissionLevels.DELETE),
  (req, res, next) => webhooksController.endPoint(req, res, next)
)

router.post('/add', 
//(req, res, next) => hasPermission(req, res, next, PermissionLevels.DELETE),
(req, res, next) => webhooksController.addHook(req, res, next)
)

router.get('/get', 
(req, res, next) => webhooksController.authenticate(req, res, next),
(req, res, next) => webhooksController.getHook(req, res, next)
)


router.delete('/delete', 
(req, res, next) => webhooksController.authenticate(req, res, next),
(req, res, next) => webhooksController.deleteHook(req, res, next)
)

