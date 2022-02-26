/**
 * Module for the AccountController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.email, req.body.password)
      const payload = {
        username: user.username,
        email: user.email,
        permissionLevel: user.permissionLevel
      }

      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, process.env.PERSONAL_ACCESS_TOKEN, {
        algorithm: 'HS256', //'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })
      res
        .status(201)
        .json({
          access_token: accessToken
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.innerException = error
      next(err)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const user = await User.insert({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        permissionLevel: 8 // change level
      })

      res
        .status(200)
        .json({
          username: user.username,
          id: user.id,
          links: {
            href: 'http://localhost:8085/login' + user.id
          }
        })
    } catch (error) {
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.innerException = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.innerException = error
      }

      next(err)
    }
  }
}
