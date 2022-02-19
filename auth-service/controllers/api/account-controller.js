/**
 * Module for the AccountController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

// import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../../models/user.js'
import { fileURLToPath } from 'url'
import fs from 'fs'

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
        sub: user.email,
        x_permission_level: 15
      }

      const privateKEY = fs.readFileSync('/Users/elida/private.pem', 'utf8')

      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, privateKEY, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })

      // // Create the refresh token with the longer lifespan.
      // -----------------------------------------------------------------
      // 👉👉👉 This is the place to create and handle the refresh token!
      //         Quite a lot of additional implementation is required!!!
      // -----------------------------------------------------------------
      // const refreshToken = ...

      res
        .status(201)
        .json({
          access_token: accessToken
          //  private_token: process.env.PERSONAL_ACCESS_TOKEN // Add personal token to headers?
          // refresh_token: refreshToken
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
        password: req.body.password
      })

      res
        .status(200)
        .json({ id: user.id })
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
